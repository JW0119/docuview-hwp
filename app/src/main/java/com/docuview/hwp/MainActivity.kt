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
import android.view.MotionEvent
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import java.io.ByteArrayOutputStream
import java.util.Locale
import java.util.zip.ZipInputStream

class MainActivity : Activity() {
    private lateinit var root: FrameLayout
    private lateinit var homeBox: LinearLayout
    private lateinit var viewerLayer: FrameLayout
    private lateinit var viewerContent: FrameLayout
    private lateinit var topBar: LinearLayout
    private lateinit var bottomBar: LinearLayout
    private lateinit var titleView: TextView
    private lateinit var pageView: TextView
    private lateinit var prevButton: Button
    private lateinit var nextButton: Button
    private lateinit var recentBox: LinearLayout

    private var currentName: String = ""
    private var currentText: String = ""
    private var currentBytesBase64: String = ""
    private var currentMode: ViewerMode = ViewerMode.NONE
    private var controlsVisible = true

    private var pdfRenderer: PdfRenderer? = null
    private var pdfPfd: ParcelFileDescriptor? = null
    private var pdfPageIndex = 0
    private var pdfPageCount = 0
    private var pdfImageView: ImageView? = null

    private var activeWebView: WebView? = null
    private var rhwpPage = 1
    private var rhwpPageCount = 0

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
            setBackgroundColor(COLOR_VIEWER_BG)
            setOnClickListener { toggleControls() }
        }
        viewerContent = FrameLayout(this).apply { setBackgroundColor(COLOR_VIEWER_BG) }
        viewerLayer.addView(viewerContent, FrameLayout.LayoutParams(-1, -1))

        topBar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(8), dp(8), dp(8), dp(8))
            setBackgroundColor(Color.argb(232, 255, 255, 255))
            elevation = dp(3).toFloat()
        }
        topBar.addView(ImageButton(this).apply {
            setImageResource(android.R.drawable.ic_menu_revert)
            setBackgroundColor(Color.TRANSPARENT)
            setColorFilter(COLOR_INK)
            contentDescription = "뒤로"
            setOnClickListener { showHome() }
        }, LinearLayout.LayoutParams(dp(44), dp(44)))
        titleView = text("", 15f, COLOR_INK, bold = true).apply {
            maxLines = 1
            ellipsize = TextUtils.TruncateAt.MIDDLE
        }
        topBar.addView(titleView, LinearLayout.LayoutParams(0, -2, 1f))
        topBar.addView(ImageButton(this).apply {
            setImageResource(android.R.drawable.ic_menu_upload)
            setBackgroundColor(Color.TRANSPARENT)
            setColorFilter(COLOR_INK)
            contentDescription = "문서 열기"
            setOnClickListener { openDocumentPicker() }
        }, LinearLayout.LayoutParams(dp(44), dp(44)))
        viewerLayer.addView(topBar, FrameLayout.LayoutParams(-1, dp(60), Gravity.TOP))

        bottomBar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(14), dp(8), dp(14), dp(10))
            setBackgroundColor(Color.argb(235, 255, 255, 255))
            elevation = dp(3).toFloat()
        }
        prevButton = Button(this).apply {
            text = "이전"
            setAllCaps(false)
            setOnClickListener { previousPage() }
        }
        nextButton = Button(this).apply {
            text = "다음"
            setAllCaps(false)
            setOnClickListener { nextPage() }
        }
        pageView = text("", 14f, COLOR_INK, bold = true).apply { gravity = Gravity.CENTER }
        bottomBar.addView(prevButton, LinearLayout.LayoutParams(dp(92), dp(46)))
        bottomBar.addView(pageView, LinearLayout.LayoutParams(0, -2, 1f))
        bottomBar.addView(nextButton, LinearLayout.LayoutParams(dp(92), dp(46)))
        viewerLayer.addView(bottomBar, FrameLayout.LayoutParams(-1, dp(66), Gravity.BOTTOM))
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
        titleView.text = currentName
        viewerContent.removeAllViews()
        homeBox.visibility = View.GONE
        viewerLayer.visibility = View.VISIBLE
        setControlsVisible(true)
        rememberRecent(currentName, uri)
        renderRecent()
        val lower = currentName.lowercase(Locale.ROOT)
        showLoading("문서를 여는 중…")
        when {
            lower.endsWith(".pdf") || mime(uri) == "application/pdf" -> renderPdf(uri)
            lower.endsWith(".hwp") || lower.endsWith(".hwpx") -> renderRhwp(uri, currentName)
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
        pageView.text = ""
        setPagingEnabled(false, false)
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
                setPadding(dp(12), dp(76), dp(12), dp(76))
                setBackgroundColor(COLOR_VIEWER_BG)
            }
            pdfImageView = ImageView(this).apply {
                adjustViewBounds = true
                scaleType = ImageView.ScaleType.FIT_CENTER
                setBackgroundColor(Color.WHITE)
                elevation = dp(2).toFloat()
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
                val maxWidth = (resources.displayMetrics.widthPixels - dp(24)).coerceAtLeast(320)
                val maxHeight = (resources.displayMetrics.heightPixels - dp(152)).coerceAtLeast(420)
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

    private fun renderRhwp(uri: Uri, fileName: String) {
        val result = runCatching {
            val bytes = contentResolver.openInputStream(uri)?.use { it.readBytes() } ?: error("read failed")
            currentBytesBase64 = Base64.encodeToString(bytes, Base64.NO_WRAP)
        }
        result.onSuccess {
            currentMode = ViewerMode.RHWP
            viewerContent.removeAllViews()
            rhwpPage = 1
            rhwpPageCount = 0
            val webView = WebView(this).apply {
                layoutParams = FrameLayout.LayoutParams(-1, -1)
                setPadding(0, dp(60), 0, dp(66))
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowFileAccess = false
                settings.allowContentAccess = true
                settings.loadWithOverviewMode = true
                settings.useWideViewPort = true
                settings.builtInZoomControls = true
                settings.displayZoomControls = false
                settings.mediaPlaybackRequiresUserGesture = true
                webChromeClient = WebChromeClient()
                webViewClient = WebViewClient()
                addJavascriptInterface(RhwpBridge(), "AndroidDocViewer")
                loadDataWithBaseURL("https://docviewer.local/", rhwpHtml(fileName), "text/html", "UTF-8", null)
            }
            activeWebView = webView
            viewerContent.addView(webView, FrameLayout.LayoutParams(-1, -1))
            pageView.text = "준비 중"
            setPagingEnabled(false, false)
        }.onFailure {
            if (fileName.lowercase(Locale.ROOT).endsWith(".hwpx")) renderZipXmlDocument(uri, XmlFamily.HWPX)
            else showViewerMessage("문서를 열 수 없습니다. HWPX 또는 PDF로 다시 시도해 주세요.", canPage = false)
        }
    }

    inner class RhwpBridge {
        @JavascriptInterface fun fileBase64(): String = currentBytesBase64
        @JavascriptInterface fun fileName(): String = currentName
        @JavascriptInterface fun onPageInfo(page: Int, count: Int) {
            runOnUiThread {
                rhwpPage = page.coerceAtLeast(1)
                rhwpPageCount = count.coerceAtLeast(0)
                updatePageLabel(rhwpPage, rhwpPageCount)
            }
        }
        @JavascriptInterface fun onReady() {
            runOnUiThread {
                if (rhwpPageCount <= 0) pageView.text = "보기 모드"
                setPagingEnabled(true, true)
            }
        }
        @JavascriptInterface fun onRenderFailed() {
            runOnUiThread { showViewerMessage("문서를 표시할 수 없습니다. 다른 파일을 선택해 주세요.", canPage = false) }
        }
    }

    private fun rhwpHtml(fileName: String): String = """
        <!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <style>
          html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
          #viewer{position:fixed;inset:0;overflow:auto;background:#eef2f7;box-sizing:border-box;padding:72px 10px 76px;}
          #loading{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;color:#667085;background:#eef2f7;font-size:14px;z-index:9999;}
          [class*='toolbar'],[class*='Toolbar'],[class*='menubar'],[class*='Menu'],[class*='sidebar'],[class*='Sidebar'],[class*='ribbon'],[class*='Ribbon'],[class*='statusbar'],[class*='StatusBar'],[class*='panel'],[class*='Panel']{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;}
          button,input,select,textarea,[role='button'],[contenteditable='true']{display:none!important;pointer-events:none!important;}
          canvas,svg{max-width:100%!important;height:auto!important;background:#fff!important;box-shadow:0 8px 24px rgba(30,41,59,.12);margin:0 auto 16px!important;display:block!important;}
          [class*='page'],[data-page]{box-shadow:0 8px 24px rgba(30,41,59,.12)!important;margin:0 auto 16px!important;background:#fff!important;max-width:100%!important;}
          *{caret-color:transparent!important;-webkit-user-select:none!important;user-select:none!important;}
        </style></head><body><div id="viewer"></div><div id="loading">문서를 여는 중…</div>
        <script type="module">
          const viewerEl = document.getElementById('viewer');
          const loading = document.getElementById('loading');
          let api = null, pages = [], currentPage = 0;
          function b64ToArrayBuffer(b64){ const bin=atob(b64); const len=bin.length; const bytes=new Uint8Array(len); for(let i=0;i<len;i++) bytes[i]=bin.charCodeAt(i); return bytes.buffer; }
          function hideChrome(){
            document.querySelectorAll("[class*='toolbar'],[class*='Toolbar'],[class*='menubar'],[class*='Menu'],[class*='sidebar'],[class*='Sidebar'],[class*='ribbon'],[class*='Ribbon'],[class*='statusbar'],[class*='StatusBar'],button,input,select,textarea,[role='button']").forEach(e=>e.remove());
            document.querySelectorAll('[contenteditable=true]').forEach(e=>e.setAttribute('contenteditable','false'));
          }
          function findPages(){
            const selectors=['[data-page]','.page','.rhwp-page','[class*=page]','canvas','svg'];
            for(const s of selectors){ const found=[...document.querySelectorAll(s)].filter(e=>e.offsetWidth>80&&e.offsetHeight>80); if(found.length) return found; }
            return [];
          }
          function sendPage(){ AndroidDocViewer.onPageInfo(Math.min(currentPage+1, Math.max(pages.length,1)), pages.length); }
          function refreshPages(){ hideChrome(); pages=findPages(); if(pages.length){ currentPage=Math.min(currentPage,pages.length-1); sendPage(); } }
          function showPage(i){
            refreshPages();
            if(api){
              if(i>currentPage && typeof api.nextPage==='function'){ api.nextPage(); currentPage=i; sendPage(); return; }
              if(i<currentPage && typeof api.prevPage==='function'){ api.prevPage(); currentPage=i; sendPage(); return; }
              if(typeof api.goToPage==='function'){ currentPage=Math.max(0,i); api.goToPage(currentPage); sendPage(); return; }
              if(typeof api.setPage==='function'){ currentPage=Math.max(0,i); api.setPage(currentPage); sendPage(); return; }
            }
            if(!pages.length) return;
            currentPage=Math.max(0,Math.min(i,pages.length-1));
            pages[currentPage].scrollIntoView({behavior:'smooth',block:'start',inline:'nearest'});
            sendPage();
          }
          window.DocViewerNextPage=()=>showPage(currentPage+1);
          window.DocViewerPrevPage=()=>showPage(currentPage-1);
          try{
            const mod=await import('https://esm.sh/@rhwp/editor');
            const create=mod.createViewer||mod.createReadOnlyEditor||mod.createEditor;
            if(!create) throw new Error('factory missing');
            api=await create('#viewer',{width:'100%',height:'100%',readOnly:true,editable:false,toolbar:false,menubar:false,statusbar:false,sidebar:false,pageMode:true,mode:'viewer'});
            const buffer=b64ToArrayBuffer(AndroidDocViewer.fileBase64());
            const result=await api.loadFile(buffer, AndroidDocViewer.fileName() || ${fileName.jsString()});
            loading.remove(); hideChrome();
            const count=(result&&result.pageCount)||api.pageCount||(typeof api.getPageCount==='function'?api.getPageCount():0)||0;
            if(count>0){ pages=new Array(count).fill(null); AndroidDocViewer.onPageInfo(1,count); }
            AndroidDocViewer.onReady();
            setTimeout(refreshPages,300); setTimeout(refreshPages,900); setTimeout(refreshPages,1800);
          }catch(e){ AndroidDocViewer.onRenderFailed(); }
        </script></body></html>
    """.trimIndent()

    private fun previousPage() {
        when (currentMode) {
            ViewerMode.PDF -> if (pdfPageIndex > 0) renderPdfPage(pdfPageIndex - 1)
            ViewerMode.RHWP -> activeWebView?.evaluateJavascript("window.DocViewerPrevPage && window.DocViewerPrevPage();", null)
            else -> Unit
        }
    }

    private fun nextPage() {
        when (currentMode) {
            ViewerMode.PDF -> if (pdfPageIndex + 1 < pdfPageCount) renderPdfPage(pdfPageIndex + 1)
            ViewerMode.RHWP -> activeWebView?.evaluateJavascript("window.DocViewerNextPage && window.DocViewerNextPage();", null)
            else -> Unit
        }
    }

    private fun updatePageLabel(page: Int, count: Int) {
        pageView.text = if (count > 0) "$page / $count" else "보기 모드"
        setPagingEnabled(page > 1 || currentMode == ViewerMode.RHWP, count == 0 || page < count || currentMode == ViewerMode.RHWP)
    }

    private fun setPagingEnabled(prev: Boolean, next: Boolean) {
        prevButton.isEnabled = prev
        nextButton.isEnabled = next
        prevButton.alpha = if (prev) 1f else .38f
        nextButton.alpha = if (next) 1f else .38f
    }

    private fun toggleControls() = setControlsVisible(!controlsVisible)

    private fun setControlsVisible(visible: Boolean) {
        controlsVisible = visible
        topBar.visibility = if (visible) View.VISIBLE else View.GONE
        bottomBar.visibility = if (visible) View.VISIBLE else View.GONE
    }

    private fun cleanupActiveDocument() {
        runCatching { pdfRenderer?.close() }
        runCatching { pdfPfd?.close() }
        pdfRenderer = null
        pdfPfd = null
        pdfImageView = null
        pdfPageIndex = 0
        pdfPageCount = 0
        activeWebView?.let {
            runCatching { it.stopLoading(); it.loadUrl("about:blank"); it.removeAllViews(); it.destroy() }
        }
        activeWebView = null
        currentBytesBase64 = ""
        currentText = ""
    }

    private fun renderPlainText(uri: Uri) {
        val result = runCatching { contentResolver.openInputStream(uri)?.bufferedReader()?.use { it.readText() }.orEmpty() }
        result.onSuccess { showTextViewer(it) }.onFailure { showViewerMessage("문서를 열 수 없습니다.", canPage = false) }
    }

    private fun renderZipXmlDocument(uri: Uri, family: XmlFamily) {
        val result = runCatching { extractZipXmlText(uri, family) }
        result.onSuccess { if (it.isBlank()) showViewerMessage("표시할 수 있는 본문을 찾지 못했습니다.", false) else showTextViewer(it) }
            .onFailure { showViewerMessage("문서를 열 수 없습니다.", false) }
    }

    private fun showTextViewer(textValue: String) {
        currentMode = ViewerMode.TEXT
        currentText = textValue
        viewerContent.removeAllViews()
        val scroll = ScrollView(this).apply { setPadding(dp(20), dp(76), dp(20), dp(78)); setBackgroundColor(COLOR_VIEWER_BG) }
        scroll.addView(text(textValue.take(MAX_TEXT_CHARS), 16f, COLOR_INK).apply {
            setBackgroundColor(Color.WHITE)
            setPadding(dp(18), dp(18), dp(18), dp(18))
            setLineSpacing(7f, 1.05f)
        })
        viewerContent.addView(scroll, FrameLayout.LayoutParams(-1, -1))
        pageView.text = "텍스트 보기"
        setPagingEnabled(false, false)
    }

    private fun showViewerMessage(message: String, canPage: Boolean) {
        currentMode = ViewerMode.NONE
        viewerContent.removeAllViews()
        viewerContent.addView(text(message, 16f, COLOR_MUTED).apply {
            gravity = Gravity.CENTER
            setPadding(dp(28), dp(28), dp(28), dp(28))
        }, FrameLayout.LayoutParams(-1, -1))
        pageView.text = ""
        setPagingEnabled(canPage, canPage)
    }

    private fun extractZipXmlText(uri: Uri, family: XmlFamily): String {
        val parts = mutableListOf<String>()
        ZipInputStream(contentResolver.openInputStream(uri)).use { zip ->
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
    private enum class ViewerMode { NONE, PDF, RHWP, TEXT }

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
        private val COLOR_APP_BG = Color.rgb(245, 247, 252)
        private val COLOR_VIEWER_BG = Color.rgb(238, 242, 247)
        private val COLOR_INK = Color.rgb(24, 31, 46)
        private val COLOR_MUTED = Color.rgb(93, 104, 126)
        private val COLOR_LINK = Color.rgb(45, 84, 176)
    }
}
