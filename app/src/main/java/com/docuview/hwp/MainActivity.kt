package com.docuview.hwp

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.database.Cursor
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.os.Bundle
import android.os.ParcelFileDescriptor
import android.provider.OpenableColumns
import android.text.TextUtils
import android.util.Base64
import android.view.Gravity
import android.view.View
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.util.Locale
import java.util.zip.ZipInputStream

class MainActivity : Activity() {
    private lateinit var root: FrameLayout
    private lateinit var homeBox: LinearLayout
    private lateinit var viewerLayer: FrameLayout
    private lateinit var viewerContent: FrameLayout
    private var swipeStartX = 0f
    private var swipeStartY = 0f
    private lateinit var recentBox: LinearLayout

    private var currentName: String = ""
    private var currentText: String = ""
    private var currentMode: ViewerMode = ViewerMode.NONE
    private var textPages: List<String> = emptyList()
    private var textPageIndex = 0

    private var pdfRenderer: PdfRenderer? = null
    private var pdfPfd: ParcelFileDescriptor? = null
    private var pdfPageIndex = 0
    private var pdfPageCount = 0
    private var pdfImageView: ImageView? = null

    private var hwpWebView: WebView? = null

    private val recentPrefs by lazy { getSharedPreferences("recent_documents", Context.MODE_PRIVATE) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        buildUi()
        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    override fun onDestroy() {
        cleanupActiveDocument()
        super.onDestroy()
    }

    override fun onBackPressed() {
        if (viewerLayer.visibility == View.VISIBLE) showHome() else super.onBackPressed()
    }

    private fun buildUi() {
        root = FrameLayout(this).apply { setBackgroundColor(COLOR_APP_BG) }
        buildHome()
        buildViewer()
        root.addView(homeBox, FrameLayout.LayoutParams(-1, -1))
        root.addView(viewerLayer, FrameLayout.LayoutParams(-1, -1))
        viewerLayer.visibility = View.GONE
        setContentView(root)
    }

    private fun buildHome() {
        homeBox = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(24), dp(34), dp(24), dp(24))
            setBackgroundColor(COLOR_APP_BG)
        }
        homeBox.addView(text("DocuView", 32f, COLOR_INK, bold = true).pad(bottom = 6))
        homeBox.addView(text("HWP · HWPX · PDF 문서를 빠르게 여는 모바일 뷰어", 14f, COLOR_MUTED).pad(bottom = 22))
        homeBox.addView(Button(this).apply {
            text = "문서 열기"
            textSize = 17f
            setAllCaps(false)
            setOnClickListener { openDocumentPicker() }
        }, LinearLayout.LayoutParams(-1, dp(54)))
        recentBox = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(28), 0, 0)
        }
        homeBox.addView(recentBox, LinearLayout.LayoutParams(-1, -2))
        renderRecent()
    }

    private fun buildViewer() {
        viewerLayer = FrameLayout(this).apply {
            setBackgroundColor(Color.WHITE)
            isClickable = true
            setOnTouchListener { _, event -> handleViewerTouch(event) }
        }
        viewerContent = FrameLayout(this).apply { setBackgroundColor(Color.WHITE) }
        viewerLayer.addView(viewerContent, FrameLayout.LayoutParams(-1, -1))
    }

    private fun handleViewerTouch(event: android.view.MotionEvent): Boolean {
        when (event.actionMasked) {
            android.view.MotionEvent.ACTION_DOWN -> {
                swipeStartX = event.x
                swipeStartY = event.y
                return true
            }
            android.view.MotionEvent.ACTION_UP -> {
                val dx = event.x - swipeStartX
                val dy = event.y - swipeStartY
                if (kotlin.math.abs(dx) > dp(56) && kotlin.math.abs(dx) > kotlin.math.abs(dy) * 1.35f) {
                    if (dx < 0) nextPage() else previousPage()
                    return true
                }
            }
        }
        return true
    }

    private fun openDocumentPicker() {
        startActivityForResult(Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*"
            putExtra(Intent.EXTRA_MIME_TYPES, supportedMimeTypes())
        }, REQUEST_OPEN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_OPEN && resultCode == RESULT_OK) {
            data?.data?.let { uri ->
                persistReadPermission(data, uri)
                render(uri)
            }
        }
    }

    private fun persistReadPermission(intent: Intent, uri: Uri) {
        runCatching {
            val flags = intent.flags and Intent.FLAG_GRANT_READ_URI_PERMISSION
            if (flags != 0) contentResolver.takePersistableUriPermission(uri, flags)
        }
    }

    private fun handleIntent(intent: Intent?) {
        intent?.data?.let { render(it) }
    }

    private fun render(uri: Uri) {
        cleanupActiveDocument()
        currentName = displayName(uri)
        viewerContent.removeAllViews()
        homeBox.visibility = View.GONE
        viewerLayer.visibility = View.VISIBLE
        enterImmersiveViewer()
        rememberRecent(currentName, uri)
        renderRecent()
        val lower = currentName.lowercase(Locale.ROOT)
        showLoading("문서를 여는 중…")
        when {
            lower.endsWith(".pdf") || mime(uri) == "application/pdf" -> renderPdf(uri)
            lower.endsWith(".hwpx") -> renderZipXmlDocument(uri, XmlFamily.HWPX)
            lower.endsWith(".hwp") -> renderBinaryHwp(uri)
            lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv") || (mime(uri)?.startsWith("text/") == true) -> renderPlainText(uri)
            lower.endsWith(".docx") -> renderZipXmlDocument(uri, XmlFamily.DOCX)
            lower.endsWith(".xlsx") -> renderZipXmlDocument(uri, XmlFamily.XLSX)
            lower.endsWith(".pptx") -> renderZipXmlDocument(uri, XmlFamily.PPTX)
            else -> showViewerMessage("이 형식은 아직 앱 안에서 바로 볼 수 없습니다.", canPage = false)
        }
    }

    private fun showHome() {
        cleanupActiveDocument()
        viewerContent.removeAllViews()
        viewerLayer.visibility = View.GONE
        homeBox.visibility = View.VISIBLE
        currentMode = ViewerMode.NONE
    }

    private fun showLoading(message: String) {
        viewerContent.removeAllViews()
        viewerContent.addView(text(message, 15f, COLOR_MUTED).apply { gravity = Gravity.CENTER }, FrameLayout.LayoutParams(-1, -1))
    }

    private fun renderPdf(uri: Uri) {
        val result = runCatching {
            pdfPfd = contentResolver.openFileDescriptor(uri, "r") ?: error("open failed")
            pdfRenderer = PdfRenderer(pdfPfd!!)
            pdfPageCount = pdfRenderer!!.pageCount
            pdfPageIndex = 0
        }
        result.onSuccess {
            currentMode = ViewerMode.PDF
            viewerContent.removeAllViews()
            val surface = FrameLayout(this).apply {
                setPadding(0, 0, 0, 0)
                setBackgroundColor(Color.WHITE)
                setOnTouchListener { _, event -> handleViewerTouch(event) }
            }
            pdfImageView = ImageView(this).apply {
                adjustViewBounds = true
                scaleType = ImageView.ScaleType.FIT_CENTER
                setBackgroundColor(Color.WHITE)
                isClickable = true
                setOnTouchListener { _, event -> handleViewerTouch(event) }
            }
            surface.addView(pdfImageView, FrameLayout.LayoutParams(-1, -1, Gravity.CENTER))
            viewerContent.addView(surface, FrameLayout.LayoutParams(-1, -1))
            renderPdfPage(0)
        }.onFailure { showViewerMessage("문서를 열 수 없습니다. 다른 파일을 선택해 주세요.", canPage = false) }
    }

    private fun renderPdfPage(index: Int) {
        val renderer = pdfRenderer ?: return
        if (index !in 0 until renderer.pageCount) return
        runCatching {
            renderer.openPage(index).use { page ->
                val maxWidth = resources.displayMetrics.widthPixels.coerceAtLeast(320)
                val maxHeight = resources.displayMetrics.heightPixels.coerceAtLeast(420)
                val scale = minOf(maxWidth.toFloat() / page.width.toFloat(), maxHeight.toFloat() / page.height.toFloat())
                val targetWidth = (page.width * scale).toInt().coerceAtLeast(1)
                val targetHeight = (page.height * scale).toInt().coerceAtLeast(1)
                val bitmap = Bitmap.createBitmap(targetWidth, targetHeight, Bitmap.Config.ARGB_8888)
                bitmap.eraseColor(Color.WHITE)
                page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
                pdfImageView?.setImageBitmap(bitmap)
            }
            pdfPageIndex = index
            updatePageLabel(index + 1, pdfPageCount)
        }.onFailure { showViewerMessage("이 페이지를 표시할 수 없습니다.", canPage = pdfPageCount > 1) }
    }

    private fun previousPage() {
        when (currentMode) {
            ViewerMode.PDF -> if (pdfPageIndex > 0) renderPdfPage(pdfPageIndex - 1)
            ViewerMode.TEXT -> if (textPageIndex > 0) renderTextPage(textPageIndex - 1)
            else -> Unit
        }
    }

    private fun nextPage() {
        when (currentMode) {
            ViewerMode.PDF -> if (pdfPageIndex + 1 < pdfPageCount) renderPdfPage(pdfPageIndex + 1)
            ViewerMode.TEXT -> if (textPageIndex + 1 < textPages.size) renderTextPage(textPageIndex + 1)
            else -> Unit
        }
    }

    private fun updatePageLabel(page: Int, count: Int) {
        // Full-screen viewer intentionally has no visible page/control chrome.
    }

    private fun enterImmersiveViewer() {
        // Keep the document surface free of app chrome while avoiding System UI ANR
        // seen on API 29 emulator when HIDE_NAVIGATION + IMMERSIVE_STICKY is toggled during QA swipes.
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        )
    }

    private fun cleanupActiveDocument() {
        runCatching { pdfRenderer?.close() }
        runCatching { pdfPfd?.close() }
        pdfRenderer = null
        pdfPfd = null
        pdfImageView = null
        hwpWebView?.let { webView ->
            runCatching { webView.stopLoading() }
            runCatching { webView.removeAllViews() }
            runCatching { webView.destroy() }
        }
        hwpWebView = null
        pdfPageIndex = 0
        pdfPageCount = 0
        currentText = ""
        textPages = emptyList()
        textPageIndex = 0
    }

    private fun renderPlainText(uri: Uri) {
        val result = runCatching { openDocumentStream(uri).bufferedReader().use { it.readText() } }
        result.onSuccess { showTextViewer(it) }.onFailure { showViewerMessage("문서를 열 수 없습니다.", canPage = false) }
    }

    private fun renderZipXmlDocument(uri: Uri, family: XmlFamily) {
        val result = runCatching { extractZipXmlText(uri, family) }
        result.onSuccess { if (it.isBlank()) showViewerMessage("표시할 수 있는 본문을 찾지 못했습니다.", false) else showTextViewer(it) }
            .onFailure { showViewerMessage("문서를 열 수 없습니다.", false) }
    }

    private fun renderBinaryHwp(uri: Uri) {
        val result = runCatching { readDocumentBytes(uri, MAX_HWP_RENDER_BYTES) }
        result.onSuccess { bytes ->
            if (bytes.isEmpty()) {
                showViewerMessage("HWP 문서가 비어 있거나 읽을 수 없습니다.", false)
                return@onSuccess
            }
            currentMode = ViewerMode.HWP_ENGINE
            viewerContent.removeAllViews()
            val encoded = Base64.encodeToString(bytes, Base64.NO_WRAP)
            val safeName = currentName.replace("\\", "\\\\").replace("'", "\\'")
            val webView = WebView(this).apply {
                setBackgroundColor(Color.WHITE)
                isClickable = true
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                settings.allowFileAccessFromFileURLs = true
                settings.allowUniversalAccessFromFileURLs = true
                settings.cacheMode = WebSettings.LOAD_DEFAULT
                settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                webChromeClient = object : WebChromeClient() {
                    override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                        Log.d("DocuViewHwp", "${consoleMessage.messageLevel()}: ${consoleMessage.message()} @ ${consoleMessage.sourceId()}:${consoleMessage.lineNumber()}")
                        return true
                    }
                }
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean = false
                    override fun onPageFinished(view: WebView, url: String?) {
                        super.onPageFinished(view, url)
                        val script = "window.renderHwpBase64('$encoded', '$safeName');"
                        view.evaluateJavascript(script, null)
                    }
                }
                addJavascriptInterface(HwpRenderBridge(uri), "AndroidHwpRenderer")
                setOnTouchListener { _, event -> handleViewerTouch(event) }
            }
            hwpWebView = webView
            viewerContent.addView(webView, FrameLayout.LayoutParams(-1, -1))
            webView.loadUrl("file:///android_asset/rhwp/viewer.html")
        }.onFailure { error ->
            Log.e("DocuViewHwp", "HWP_RENDER_FAILED: WebView setup failed", error)
            showViewerMessage("HWP 렌더링 엔진을 시작하지 못했습니다.\n${error.message ?: "unknown error"}", false)
        }
    }

    inner class HwpRenderBridge(private val sourceUri: Uri) {
        @JavascriptInterface fun onStatus(message: String) {
            Log.d("DocuViewHwp", "HWP_RENDER_STATUS: $message")
        }
        @JavascriptInterface fun onRendered(pageCount: String) {
            Log.i("DocuViewHwp", "HWP_RENDER_SUCCESS: pages=$pageCount source=$sourceUri")
        }
        @JavascriptInterface fun onFailed(message: String) {
            Log.e("DocuViewHwp", "HWP_RENDER_FAILED: $message source=$sourceUri")
            runOnUiThread {
                showViewerMessage("HWP 렌더링 엔진이 문서를 표시하지 못했습니다.\n$message", false)
            }
        }
    }

    private fun showTextViewer(textValue: String) {
        currentMode = ViewerMode.TEXT
        currentText = textValue
        textPages = paginateText(textValue)
        textPageIndex = 0
        viewerContent.removeAllViews()
        renderTextPage(0)
    }

    private fun renderTextPage(index: Int) {
        if (textPages.isEmpty()) return
        textPageIndex = index.coerceIn(0, textPages.lastIndex)
        viewerContent.removeAllViews()
        val page = TextView(this).apply {
            text = textPages[textPageIndex]
            textSize = 17f
            setTextColor(COLOR_INK)
            setBackgroundColor(Color.WHITE)
            setPadding(dp(22), dp(28), dp(22), dp(28))
            setLineSpacing(8f, 1.08f)
            gravity = Gravity.TOP or Gravity.START
            isClickable = true
            setOnTouchListener { _, event -> handleViewerTouch(event) }
        }
        viewerContent.addView(page, FrameLayout.LayoutParams(-1, -1))
    }

    private fun paginateText(value: String): List<String> {
        val charsPerPage = 1450
        val clean = value.replace(Regex("\n{3,}"), "\n\n").trim()
        if (clean.isBlank()) return listOf("표시할 본문이 없습니다.")
        val explicitPages = clean
            .split(Regex("(?m)^---\\s*page break[^\\n]*---\\s*$|\\f"))
            .map { it.trim() }
            .filter { it.isNotBlank() }
        if (explicitPages.size > 1) return explicitPages
        val pages = mutableListOf<String>()
        var remaining = clean
        while (remaining.isNotBlank()) {
            if (remaining.length <= charsPerPage) { pages += remaining; break }
            val cutAt = remaining.lastIndexOf('\n', charsPerPage).takeIf { it > charsPerPage / 2 }
                ?: remaining.lastIndexOf(' ', charsPerPage).takeIf { it > charsPerPage / 2 }
                ?: charsPerPage
            pages += remaining.substring(0, cutAt).trim()
            remaining = remaining.substring(cutAt).trimStart()
        }
        return pages
    }

    private fun showViewerMessage(message: String, canPage: Boolean) {
        currentMode = ViewerMode.NONE
        viewerContent.removeAllViews()
        viewerContent.addView(text(message, 16f, COLOR_MUTED).apply {
            gravity = Gravity.CENTER
            setPadding(dp(28), dp(28), dp(28), dp(28))
            isClickable = true
            setOnTouchListener { _, event -> handleViewerTouch(event) }
        }, FrameLayout.LayoutParams(-1, -1))
    }

    private fun extractZipXmlText(uri: Uri, family: XmlFamily): String {
        val parts = mutableListOf<String>()
        ZipInputStream(openDocumentStream(uri)).use { zip ->
            while (true) {
                val entry = zip.nextEntry ?: break
                if (!entry.isDirectory && family.accept(entry.name)) {
                    val text = zip.readEntryBytes(2_000_000).toString(Charsets.UTF_8).xmlToReadableText()
                    if (text.isNotBlank()) parts += text
                }
                zip.closeEntry()
            }
        }
        return parts.joinToString("\n\n").trim().take(MAX_TEXT_CHARS)
    }

    private fun extractBinaryHwpText(uri: Uri): String {
        val bytes = openDocumentStream(uri).use { input ->
            val out = ByteArrayOutputStream()
            val buffer = ByteArray(8192)
            var total = 0
            while (total < MAX_BINARY_HWP_BYTES) {
                val read = input.read(buffer, 0, minOf(buffer.size, MAX_BINARY_HWP_BYTES - total))
                if (read <= 0) break
                out.write(buffer, 0, read)
                total += read
            }
            out.toByteArray()
        }
        val candidates = mutableListOf<String>()
        candidates += bytes.extractPrintableAsciiRuns()
        candidates += bytes.extractUtf16LeRuns()
        return candidates
            .flatMap { it.lines() }
            .map { it.trim() }
            .filter { it.length >= 3 && !it.matches(Regex("^[\\p{Punct}\\d\\s]+$")) }
            .distinct()
            .joinToString("\n")
            .replace(Regex("\n{3,}"), "\n\n")
            .trim()
            .take(MAX_TEXT_CHARS)
    }

    private fun ByteArray.extractPrintableAsciiRuns(): String {
        val parts = mutableListOf<String>()
        val current = StringBuilder()
        for (byte in this) {
            val value = byte.toInt() and 0xFF
            val char = value.toChar()
            if (char == '\n' || char == '\r' || char == '\t' || value in 0x20..0x7E) {
                current.append(if (char == '\r') '\n' else char)
            } else {
                if (current.length >= 4) parts += current.toString()
                current.clear()
            }
        }
        if (current.length >= 4) parts += current.toString()
        return parts.joinToString("\n").replace(Regex("[ \\t]+"), " ").trim()
    }

    private fun ByteArray.extractUtf16LeRuns(): String {
        val parts = mutableListOf<String>()
        val current = StringBuilder()
        var index = 0
        while (index + 1 < size) {
            val code = (this[index].toInt() and 0xFF) or ((this[index + 1].toInt() and 0xFF) shl 8)
            val char = code.toChar()
            val readable = char == '\n' || char == '\r' || char == '\t' || char in ' '..'~' || char.code in 0xAC00..0xD7A3
            if (readable) {
                current.append(if (char == '\r') '\n' else char)
            } else {
                if (current.length >= 4) parts += current.toString()
                current.clear()
            }
            index += 2
        }
        if (current.length >= 4) parts += current.toString()
        return parts.joinToString("\n").replace(Regex("[ \\t]+"), " ").trim()
    }

    private fun openDocumentStream(uri: Uri): InputStream {
        runCatching { contentResolver.openInputStream(uri) }.getOrNull()?.let { return it }
        if (uri.scheme == "file") {
            val path = uri.path ?: error("missing file path")
            return FileInputStream(File(path))
        }
        error("cannot open document uri: $uri")
    }

    private fun readDocumentBytes(uri: Uri, maxBytes: Int): ByteArray {
        openDocumentStream(uri).use { input ->
            val out = ByteArrayOutputStream()
            val buffer = ByteArray(8192)
            var total = 0
            while (true) {
                val remaining = maxBytes - total
                if (remaining <= 0) break
                val read = input.read(buffer, 0, minOf(buffer.size, remaining))
                if (read <= 0) break
                out.write(buffer, 0, read)
                total += read
            }
            return out.toByteArray()
        }
    }

    private fun ZipInputStream.readEntryBytes(maxBytes: Int): ByteArray {
        val out = ByteArrayOutputStream(); val buffer = ByteArray(8192); var total = 0
        while (true) { val read = read(buffer); if (read <= 0) break; total += read; if (total > maxBytes) break; out.write(buffer, 0, read) }
        return out.toByteArray()
    }

    private fun String.xmlToReadableText(): String = this
        .replace(Regex("<(w:p|hp:p|p:sp|a:p|row|tr)[^>]*>", RegexOption.IGNORE_CASE), "\n")
        .replace(Regex("</(w:p|hp:p|p:sp|a:p|row|tr)>", RegexOption.IGNORE_CASE), "\n")
        .replace(Regex("<(w:tab|hp:tab)[^>]*/>", RegexOption.IGNORE_CASE), "\t")
        .replace(Regex("<[^>]+>"), " ")
        .decodeXmlEntities()
        .replace(Regex("[ \\t\\x0B\\f\\r]+"), " ")
        .replace(Regex(" *\\n *"), "\n")
        .replace(Regex("\\n{3,}"), "\n\n")
        .lines().map { it.trim() }.filter { it.isNotBlank() }.joinToString("\n").trim()

    private fun String.decodeXmlEntities(): String = this.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").replace("&quot;", "\"").replace("&apos;", "'")

    private fun renderRecent() {
        recentBox.removeAllViews()
        val items = recentItems()
        if (items.isEmpty()) {
            recentBox.addView(text("최근 문서가 없습니다.", 14f, COLOR_MUTED))
            return
        }
        recentBox.addView(text("최근 문서", 18f, COLOR_INK, bold = true).pad(bottom = 10))
        items.forEach { item ->
            recentBox.addView(TextView(this).apply {
                text = item.name
                textSize = 15f
                maxLines = 1
                ellipsize = TextUtils.TruncateAt.MIDDLE
                setTextColor(COLOR_LINK)
                setPadding(dp(14), dp(12), dp(14), dp(12))
                setBackgroundColor(Color.WHITE)
                setOnClickListener { render(Uri.parse(item.uri)) }
            }, LinearLayout.LayoutParams(-1, -2).apply { setMargins(0, 0, 0, dp(8)) })
        }
    }

    private fun rememberRecent(name: String, uri: Uri) {
        val line = "${name.sanitize()}|||$uri"
        val merged = (listOf(line) + recentPrefs.getString(KEY_RECENT, "").orEmpty().split("\n"))
            .filter { it.contains("|||") }.distinctBy { it.substringAfter("|||") }.take(8)
        recentPrefs.edit().putString(KEY_RECENT, merged.joinToString("\n")).apply()
    }

    private fun recentItems(): List<RecentItem> = recentPrefs.getString(KEY_RECENT, "").orEmpty().split("\n").mapNotNull {
        val parts = it.split("|||", limit = 2); if (parts.size == 2) RecentItem(parts[0], parts[1]) else null
    }

    private fun displayName(uri: Uri): String {
        if (uri.scheme == "content") {
            var cursor: Cursor? = null
            try {
                cursor = contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)
                if (cursor?.moveToFirst() == true) {
                    val idx = cursor!!.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    if (idx >= 0) return cursor!!.getString(idx)
                }
            } finally { cursor?.close() }
        }
        return uri.lastPathSegment?.substringAfterLast('/') ?: uri.toString()
    }

    private fun mime(uri: Uri): String? = contentResolver.getType(uri)

    private fun supportedMimeTypes() = arrayOf(
        "application/pdf", "text/*", "text/plain", "text/markdown", "text/csv",
        "application/vnd.hancom.hwp", "application/haansofthwp", "application/x-hwp", "application/vnd.hancom.hwpx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint"
    )

    private fun text(value: String, size: Float, color: Int, bold: Boolean = false): TextView = TextView(this).apply {
        text = value
        textSize = size
        setTextColor(color)
        if (bold) typeface = Typeface.DEFAULT_BOLD
        setLineSpacing(2f, 1.0f)
    }

    private fun TextView.pad(top: Int = 0, bottom: Int = 0): TextView { setPadding(paddingLeft, dp(top), paddingRight, dp(bottom)); return this }
    private fun String.sanitize(): String = replace("\n", " ").replace("|||", " ").trim()
    private fun String.jsString(): String = "'" + replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n") + "'"
    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    private data class RecentItem(val name: String, val uri: String)
    private enum class ViewerMode { NONE, PDF, TEXT, HWP_ENGINE }

    private enum class XmlFamily(val label: String) {
        HWPX("HWPX") { override fun accept(name: String): Boolean { val n = name.lowercase(Locale.ROOT); return n.endsWith(".xml") && (n.contains("contents/") || n.contains("section") || n.contains("content")) } },
        DOCX("Word") { override fun accept(name: String): Boolean = name.lowercase(Locale.ROOT) == "word/document.xml" },
        XLSX("Excel") { override fun accept(name: String): Boolean { val n = name.lowercase(Locale.ROOT); return n == "xl/sharedstrings.xml" || (n.startsWith("xl/worksheets/") && n.endsWith(".xml")) } },
        PPTX("PowerPoint") { override fun accept(name: String): Boolean { val n = name.lowercase(Locale.ROOT); return n.startsWith("ppt/slides/") && n.endsWith(".xml") } };
        abstract fun accept(name: String): Boolean
    }

    companion object {
        private const val REQUEST_OPEN = 10
        private const val KEY_RECENT = "items"
        private const val MAX_TEXT_CHARS = 120_000
        private const val MAX_BINARY_HWP_BYTES = 4_000_000
        private const val MAX_HWP_RENDER_BYTES = 24_000_000
        private val COLOR_APP_BG = Color.rgb(245, 247, 252)
        private val COLOR_VIEWER_BG = Color.rgb(238, 242, 247)
        private val COLOR_INK = Color.rgb(24, 31, 46)
        private val COLOR_MUTED = Color.rgb(93, 104, 126)
        private val COLOR_LINK = Color.rgb(45, 84, 176)
    }
}
