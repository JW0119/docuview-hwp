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
import android.provider.OpenableColumns
import android.text.TextUtils
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import java.io.ByteArrayOutputStream
import java.util.Locale
import java.util.zip.ZipInputStream

class MainActivity : Activity() {
    private lateinit var root: LinearLayout
    private lateinit var recentBox: LinearLayout
    private lateinit var documentBox: LinearLayout
    private lateinit var searchInput: EditText
    private var currentText: String = ""
    private var currentName: String = ""
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

    private fun buildUi() {
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(20), dp(18), dp(20), dp(24))
            setBackgroundColor(Color.rgb(247, 249, 255))
        }

        root.addView(text("Doc Viewer", 31f, Color.rgb(26, 30, 50), bold = true))
        root.addView(text("HWPX · PDF · TXT · Office 문서를 한 앱에서 빠르게 확인", 14f, Color.rgb(82, 88, 116)).pad(bottom = 14))

        val openButton = Button(this).apply {
            text = "문서 열기"
            setAllCaps(false)
            setOnClickListener { openDocumentPicker() }
        }
        root.addView(openButton)
        root.addView(statusCard("지원 형식", "PDF 미리보기 · HWPX 본문/표 텍스트 · DOCX/XLSX/PPTX 텍스트 · TXT/MD/CSV · HWP 변환 슬롯"))

        searchInput = EditText(this).apply {
            hint = "현재 문서에서 검색"
            setSingleLine(true)
            visibility = View.GONE
        }
        val searchButton = Button(this).apply {
            text = "검색"
            setAllCaps(false)
            setOnClickListener { searchInCurrentDocument() }
        }
        val searchRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            visibility = View.GONE
            tag = "searchRow"
            addView(searchInput, LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f))
            addView(searchButton)
        }
        root.addView(searchRow)

        recentBox = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        root.addView(recentBox)

        documentBox = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        root.addView(documentBox)

        renderRecent()
        setContentView(ScrollView(this).apply { addView(root) })
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
        documentBox.removeAllViews()
        currentText = ""
        currentName = displayName(uri)
        rememberRecent(currentName, uri)
        renderRecent()
        setSearchVisible(false)

        val meta = metadata(uri, currentName)
        documentBox.addView(sectionTitle("열린 문서"))
        documentBox.addView(statusCard(currentName, meta))

        val lower = currentName.lowercase(Locale.ROOT)
        when {
            lower.endsWith(".pdf") || mime(uri) == "application/pdf" -> renderPdf(uri)
            lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv") || (mime(uri)?.startsWith("text/") == true) -> renderPlainText(uri)
            lower.endsWith(".hwpx") -> renderZipXmlDocument(uri, XmlFamily.HWPX)
            lower.endsWith(".docx") -> renderZipXmlDocument(uri, XmlFamily.DOCX)
            lower.endsWith(".xlsx") -> renderZipXmlDocument(uri, XmlFamily.XLSX)
            lower.endsWith(".pptx") -> renderZipXmlDocument(uri, XmlFamily.PPTX)
            lower.endsWith(".hwp") -> renderRoadmap("HWP 바이너리", "HWP 파일은 인식했습니다. 완전 조판 렌더링은 rhwp/WASM 또는 서버 변환 엔진 연결 단계가 필요합니다. 현재 버전은 오해를 피하기 위해 미지원이 아니라 ‘변환 엔진 대기’로 표시합니다.")
            isLegacyOffice(lower) -> renderRoadmap("레거시 Office 문서", "DOC/XLS/PPT는 바이너리 형식입니다. 다음 단계에서 LibreOffice/Collabora 변환 서버 또는 Android 내 변환 엔진을 연결합니다.")
            else -> renderRoadmap("알 수 없는 문서 형식", "파일을 열었지만 내장 렌더러가 아직 연결되지 않았습니다. PDF, HWPX, DOCX, XLSX, PPTX, TXT 계열을 우선 지원합니다.")
        }
    }

    private fun renderPlainText(uri: Uri) {
        val result = runCatching {
            contentResolver.openInputStream(uri)?.bufferedReader()?.use { it.readText() }.orEmpty()
        }
        result.onSuccess { showExtractedText("텍스트 문서", it) }
            .onFailure { showError("텍스트 읽기 실패", it) }
    }

    private fun renderPdf(uri: Uri) {
        val result = runCatching {
            val pfd = contentResolver.openFileDescriptor(uri, "r") ?: error("파일을 열 수 없습니다")
            val renderer = PdfRenderer(pfd)
            val pageCount = renderer.pageCount
            val page = renderer.openPage(0)
            val scale = 2
            val bitmap = Bitmap.createBitmap(page.width * scale, page.height * scale, Bitmap.Config.ARGB_8888)
            page.render(bitmap, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
            page.close(); renderer.close(); pfd.close()
            Pair(bitmap, pageCount)
        }
        result.onSuccess { (bitmap, pageCount) ->
            documentBox.addView(sectionTitle("PDF 미리보기"))
            documentBox.addView(text("총 ${pageCount}쪽 중 첫 페이지를 렌더링했습니다.", 13f, Color.rgb(85, 90, 118)).pad(bottom = 8))
            documentBox.addView(ImageView(this).apply {
                setImageBitmap(bitmap)
                adjustViewBounds = true
                setBackgroundColor(Color.WHITE)
            })
        }.onFailure { showError("PDF 렌더링 실패", it) }
    }

    private fun renderZipXmlDocument(uri: Uri, family: XmlFamily) {
        val result = runCatching { extractZipXmlText(uri, family) }
        result.onSuccess { extracted ->
            if (extracted.isBlank()) renderRoadmap(family.label, "문서를 열었지만 추출 가능한 본문 텍스트를 찾지 못했습니다. 암호화, 이미지 기반 문서, 특수 구조일 수 있습니다.")
            else showExtractedText(family.label, extracted)
        }.onFailure { showError("${family.label} 읽기 실패", it) }
    }

    private fun extractZipXmlText(uri: Uri, family: XmlFamily): String {
        val parts = mutableListOf<String>()
        ZipInputStream(contentResolver.openInputStream(uri)).use { zip ->
            while (true) {
                val entry = zip.nextEntry ?: break
                if (!entry.isDirectory && family.accept(entry.name)) {
                    val bytes = zip.readEntryBytes(maxBytes = 2_000_000)
                    val xml = bytes.toString(Charsets.UTF_8)
                    val text = xmlToReadableText(xml)
                    if (text.isNotBlank()) parts += text
                }
                zip.closeEntry()
            }
        }
        return parts.joinToString("\n\n").trim().take(MAX_TEXT_CHARS)
    }

    private fun ZipInputStream.readEntryBytes(maxBytes: Int): ByteArray {
        val out = ByteArrayOutputStream()
        val buffer = ByteArray(8192)
        var total = 0
        while (true) {
            val read = read(buffer)
            if (read <= 0) break
            total += read
            if (total > maxBytes) break
            out.write(buffer, 0, read)
        }
        return out.toByteArray()
    }

    private fun xmlToReadableText(xml: String): String {
        return xml
            .replace(Regex("<(w:p|hp:p|p:sp|a:p|row|tr)[^>]*>", RegexOption.IGNORE_CASE), "\n")
            .replace(Regex("</(w:p|hp:p|p:sp|a:p|row|tr)>", RegexOption.IGNORE_CASE), "\n")
            .replace(Regex("<(w:tab|hp:tab)[^>]*/>", RegexOption.IGNORE_CASE), "\t")
            .replace(Regex("<[^>]+>"), " ")
            .decodeXmlEntities()
            .replace(Regex("[ \\t\\x0B\\f\\r]+"), " ")
            .replace(Regex(" *\\n *"), "\n")
            .replace(Regex("\\n{3,}"), "\n\n")
            .lines()
            .map { it.trim() }
            .filter { it.isNotBlank() }
            .joinToString("\n")
            .trim()
    }

    private fun String.decodeXmlEntities(): String = this
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&amp;", "&")
        .replace("&quot;", "\"")
        .replace("&apos;", "'")

    private fun showExtractedText(label: String, extracted: String) {
        currentText = extracted
        setSearchVisible(extracted.isNotBlank())
        documentBox.addView(sectionTitle(label))
        documentBox.addView(statusCard("추출 결과", "${extracted.length}자 추출 · 문서 내 검색 가능"))
        documentBox.addView(text(extracted, 15f, Color.rgb(38, 42, 58)).pad(top = 8))
    }

    private fun renderRoadmap(title: String, body: String) {
        currentText = ""
        setSearchVisible(false)
        documentBox.addView(sectionTitle(title))
        documentBox.addView(statusCard("렌더링 엔진 연결 필요", body))
    }

    private fun showError(title: String, error: Throwable) {
        currentText = ""
        setSearchVisible(false)
        documentBox.addView(sectionTitle(title))
        documentBox.addView(statusCard("오류", error.message ?: error::class.java.simpleName, error = true))
    }

    private fun setSearchVisible(visible: Boolean) {
        searchInput.visibility = if (visible) View.VISIBLE else View.GONE
        (root.findViewWithTag<View>("searchRow"))?.visibility = if (visible) View.VISIBLE else View.GONE
    }

    private fun searchInCurrentDocument() {
        val q = searchInput.text?.toString()?.trim().orEmpty()
        if (q.isBlank()) {
            Toast.makeText(this, "검색어를 입력하세요", Toast.LENGTH_SHORT).show()
            return
        }
        val count = Regex(Regex.escape(q), RegexOption.IGNORE_CASE).findAll(currentText).count()
        Toast.makeText(this, "'$q' ${count}건", Toast.LENGTH_SHORT).show()
    }

    private fun renderRecent() {
        recentBox.removeAllViews()
        val items = recentItems()
        if (items.isEmpty()) return
        recentBox.addView(sectionTitle("최근 문서"))
        items.forEach { item ->
            val row = TextView(this).apply {
                text = "• ${item.name}"
                textSize = 14f
                maxLines = 1
                ellipsize = TextUtils.TruncateAt.MIDDLE
                setTextColor(Color.rgb(52, 72, 140))
                setPadding(0, dp(4), 0, dp(4))
                setOnClickListener { render(Uri.parse(item.uri)) }
            }
            recentBox.addView(row)
        }
    }

    private fun rememberRecent(name: String, uri: Uri) {
        val line = "${name.sanitize()}|||$uri"
        val merged = (listOf(line) + recentPrefs.getString(KEY_RECENT, "").orEmpty().split("\n"))
            .filter { it.contains("|||") }
            .distinctBy { it.substringAfter("|||") }
            .take(8)
        recentPrefs.edit().putString(KEY_RECENT, merged.joinToString("\n")).apply()
    }

    private fun recentItems(): List<RecentItem> {
        return recentPrefs.getString(KEY_RECENT, "").orEmpty().split("\n")
            .mapNotNull {
                val parts = it.split("|||", limit = 2)
                if (parts.size == 2) RecentItem(parts[0], parts[1]) else null
            }
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
            } finally {
                cursor?.close()
            }
        }
        return uri.lastPathSegment?.substringAfterLast('/') ?: uri.toString()
    }

    private fun metadata(uri: Uri, name: String): String {
        val type = mime(uri) ?: "unknown"
        val size = size(uri)?.let { humanSize(it) } ?: "unknown size"
        return "형식: ${extension(name).uppercase(Locale.ROOT).ifBlank { type }} · MIME: $type · 크기: $size"
    }

    private fun mime(uri: Uri): String? = contentResolver.getType(uri)

    private fun size(uri: Uri): Long? {
        var cursor: Cursor? = null
        return try {
            cursor = contentResolver.query(uri, arrayOf(OpenableColumns.SIZE), null, null, null)
            if (cursor?.moveToFirst() == true) {
                val idx = cursor!!.getColumnIndex(OpenableColumns.SIZE)
                if (idx >= 0 && !cursor!!.isNull(idx)) cursor!!.getLong(idx) else null
            } else null
        } finally {
            cursor?.close()
        }
    }

    private fun extension(name: String): String = name.substringAfterLast('.', "")

    private fun humanSize(bytes: Long): String {
        if (bytes < 1024) return "$bytes B"
        val kb = bytes / 1024.0
        if (kb < 1024) return String.format(Locale.US, "%.1f KB", kb)
        val mb = kb / 1024.0
        return String.format(Locale.US, "%.1f MB", mb)
    }

    private fun isLegacyOffice(lower: String): Boolean = lower.endsWith(".doc") || lower.endsWith(".xls") || lower.endsWith(".ppt")

    private fun supportedMimeTypes() = arrayOf(
        "application/pdf", "text/*", "text/plain", "text/markdown", "text/csv",
        "application/vnd.hancom.hwp", "application/haansofthwp", "application/x-hwp", "application/vnd.hancom.hwpx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword", "application/vnd.ms-excel", "application/vnd.ms-powerpoint",
        "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet", "application/vnd.oasis.opendocument.presentation"
    )

    private fun sectionTitle(value: String): TextView = text(value, 17f, Color.rgb(34, 38, 62), bold = true).pad(top = 18, bottom = 8)

    private fun statusCard(title: String, body: String, error: Boolean = false): TextView {
        return text("$title\n$body", 14f, if (error) Color.rgb(120, 30, 30) else Color.rgb(54, 60, 88)).apply {
            setPadding(dp(14), dp(12), dp(14), dp(12))
            setBackgroundColor(if (error) Color.rgb(255, 238, 238) else Color.WHITE)
        }.pad(top = 8, bottom = 8)
    }

    private fun text(value: String, size: Float, color: Int, bold: Boolean = false): TextView {
        return TextView(this).apply {
            text = value
            textSize = size
            setTextColor(color)
            if (bold) typeface = Typeface.DEFAULT_BOLD
            setLineSpacing(2f, 1.0f)
        }
    }

    private fun TextView.pad(top: Int = 0, bottom: Int = 0): TextView {
        setPadding(paddingLeft, dp(top), paddingRight, dp(bottom))
        return this
    }

    private fun String.sanitize(): String = replace("\n", " ").replace("|||", " ").trim()
    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    private data class RecentItem(val name: String, val uri: String)

    private enum class XmlFamily(val label: String) {
        HWPX("HWPX 텍스트 보기") {
            override fun accept(name: String): Boolean {
                val n = name.lowercase(Locale.ROOT)
                return n.endsWith(".xml") && (n.contains("contents/") || n.contains("section") || n.contains("content"))
            }
        },
        DOCX("Word 문서 텍스트 보기") {
            override fun accept(name: String): Boolean = name.lowercase(Locale.ROOT) == "word/document.xml"
        },
        XLSX("Excel 문서 텍스트 보기") {
            override fun accept(name: String): Boolean {
                val n = name.lowercase(Locale.ROOT)
                return n == "xl/sharedstrings.xml" || (n.startsWith("xl/worksheets/") && n.endsWith(".xml"))
            }
        },
        PPTX("PowerPoint 문서 텍스트 보기") {
            override fun accept(name: String): Boolean {
                val n = name.lowercase(Locale.ROOT)
                return n.startsWith("ppt/slides/") && n.endsWith(".xml")
            }
        };
        abstract fun accept(name: String): Boolean
    }

    companion object {
        private const val REQUEST_OPEN = 10
        private const val KEY_RECENT = "items"
        private const val MAX_TEXT_CHARS = 120_000
    }
}
