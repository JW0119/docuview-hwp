package com.docuview.hwp

import android.app.*
import android.os.*
import android.content.*
import android.database.Cursor
import android.graphics.*
import android.graphics.pdf.PdfRenderer
import android.net.Uri
import android.provider.OpenableColumns
import android.view.*
import android.widget.*
import java.io.*
import java.util.zip.ZipInputStream

class MainActivity : Activity() {
    private lateinit var container: LinearLayout
    private lateinit var recentBox: LinearLayout
    private val recentPrefs by lazy { getSharedPreferences("recent_documents", MODE_PRIVATE) }

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
        container = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(28, 28, 28, 28)
            setBackgroundColor(Color.rgb(248, 249, 255))
        }

        val title = TextView(this).apply {
            text = "Doc Viewer"
            textSize = 30f
            setTextColor(Color.rgb(30, 33, 54))
            typeface = Typeface.DEFAULT_BOLD
        }
        val sub = TextView(this).apply {
            text = "HWP/HWPX부터 PDF · TXT · Office 문서까지 빠르게 여는 통합 문서 뷰어"
            textSize = 15f
            setTextColor(Color.rgb(85, 90, 120))
            setPadding(0, 8, 0, 18)
        }
        val pick = Button(this).apply {
            text = "문서 열기"
            setOnClickListener {
                startActivityForResult(Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                }, 10)
            }
        }
        val chips = TextView(this).apply {
            text = "지원: PDF 미리보기 · TXT/MD/CSV · HWPX 텍스트 추출 · HWP/Office 변환 슬롯"
            textSize = 13f
            setTextColor(Color.rgb(95, 100, 130))
            setPadding(0, 12, 0, 18)
        }
        recentBox = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }

        container.addView(title)
        container.addView(sub)
        container.addView(pick)
        container.addView(chips)
        container.addView(recentBox)
        renderRecent()
        setContentView(ScrollView(this).apply { addView(container) })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 10 && resultCode == RESULT_OK) data?.data?.let {
            contentResolver.takePersistableUriPermissionSafe(data, it)
            render(it)
        }
    }

    private fun ContentResolver.takePersistableUriPermissionSafe(intent: Intent, uri: Uri) {
        runCatching {
            val flags = intent.flags and (Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            takePersistableUriPermission(uri, flags)
        }
    }

    private fun handleIntent(i: Intent?) { i?.data?.let { render(it) } }

    private fun render(uri: Uri) {
        while (container.childCount > 5) container.removeViewAt(5)
        val name = displayName(uri)
        rememberRecent(name, uri)
        renderRecent()
        container.addView(TextView(this).apply {
            text = "열린 문서: $name"
            textSize = 18f
            setTextColor(Color.rgb(35, 36, 55))
            setPadding(0, 18, 0, 10)
            typeface = Typeface.DEFAULT_BOLD
        })
        val lower = name.lowercase()
        when {
            lower.endsWith(".pdf") -> renderPdf(uri)
            lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv") -> renderText(uri)
            lower.endsWith(".hwpx") -> renderHwpx(uri)
            lower.endsWith(".hwp") -> showPlaceholder(
                "HWP 문서",
                "HWP 바이너리 문서는 정확한 조판 렌더링을 위해 변환 엔진 연결이 필요합니다. 현재 빌드는 HWP 파일을 인식하고, 다음 단계에서 rhwp/WASM 또는 서버 변환 PDF 렌더링을 연결하도록 설계했습니다."
            )
            isOffice(lower) -> showPlaceholder(
                "Office 문서",
                "DOCX/XLSX/PPTX 파일을 인식했습니다. 다음 단계는 LibreOffice/Collabora 변환 또는 문서별 XML 추출기를 연결해 앱 안에서 미리보기를 완성합니다."
            )
            else -> showPlaceholder("범용 문서", "지원 후보 형식으로 인식했습니다. 파일 정보와 열기 진입은 동작하며, 렌더링 엔진을 순차 연결합니다.")
        }
    }

    private fun displayName(uri: Uri): String {
        if (uri.scheme == "content") {
            var cursor: Cursor? = null
            runCatching {
                cursor = contentResolver.query(uri, null, null, null, null)
                cursor?.let {
                    if (it.moveToFirst()) {
                        val idx = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                        if (idx >= 0) return it.getString(idx)
                    }
                }
            }
            cursor?.close()
        }
        return uri.lastPathSegment ?: uri.toString()
    }

    private fun rememberRecent(name: String, uri: Uri) {
        val previous = recentPrefs.getString("items", "") ?: ""
        val line = "$name|||$uri"
        val items = (listOf(line) + previous.split("\n").filter { it.isNotBlank() && !it.endsWith("|||$uri") }).take(5)
        recentPrefs.edit().putString("items", items.joinToString("\n")).apply()
    }

    private fun renderRecent() {
        recentBox.removeAllViews()
        val items = (recentPrefs.getString("items", "") ?: "").split("\n").filter { it.isNotBlank() }
        if (items.isEmpty()) return
        recentBox.addView(TextView(this).apply {
            text = "최근 문서"
            textSize = 16f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.rgb(45, 48, 70))
            setPadding(0, 0, 0, 6)
        })
        items.forEach { raw ->
            val parts = raw.split("|||", limit = 2)
            val name = parts.getOrNull(0) ?: raw
            val uri = parts.getOrNull(1)
            recentBox.addView(TextView(this).apply {
                text = "• $name"
                textSize = 14f
                setTextColor(Color.rgb(68, 79, 130))
                setPadding(0, 4, 0, 4)
                if (uri != null) setOnClickListener { render(Uri.parse(uri)) }
            })
        }
    }

    private fun renderText(uri: Uri) {
        runCatching { contentResolver.openInputStream(uri)?.bufferedReader()?.readText()?.take(50000) }
            .onSuccess { addBody(it ?: "") }
            .onFailure { showPlaceholder("텍스트 읽기 실패", it.message ?: "unknown") }
    }

    private fun renderHwpx(uri: Uri) {
        runCatching {
            val out = StringBuilder()
            ZipInputStream(contentResolver.openInputStream(uri)).use { zis ->
                while (true) {
                    val entry = zis.nextEntry ?: break
                    if (!entry.isDirectory && entry.name.lowercase().endsWith(".xml") &&
                        (entry.name.contains("Contents/") || entry.name.contains("content"))) {
                        val xml = zis.bufferedReader(Charsets.UTF_8).readText()
                        out.append(xmlToReadableText(xml)).append("\n\n")
                    }
                    zis.closeEntry()
                }
            }
            out.toString().trim().take(80000)
        }.onSuccess {
            if (it.isBlank()) showPlaceholder("HWPX 추출 결과 없음", "문서 구조가 일반 HWPX 본문 XML과 다르거나 암호화/손상되었을 수 있습니다.")
            else addBody(it)
        }.onFailure { showPlaceholder("HWPX 읽기 실패", it.message ?: "unknown") }
    }

    private fun xmlToReadableText(xml: String): String {
        return xml
            .replace(Regex("<[^>]+>"), " ")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&amp;", "&")
            .replace("&quot;", "\"")
            .replace(Regex("[ \\t\\x0B\\f\\r]+"), " ")
            .replace(Regex("\\n\\s*\\n+"), "\n")
            .trim()
    }

    private fun renderPdf(uri: Uri) {
        runCatching {
            val pfd = contentResolver.openFileDescriptor(uri, "r")!!
            val renderer = PdfRenderer(pfd)
            val page = renderer.openPage(0)
            val bmp = Bitmap.createBitmap(page.width * 2, page.height * 2, Bitmap.Config.ARGB_8888)
            page.render(bmp, null, null, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY)
            page.close(); renderer.close(); pfd.close(); bmp
        }.onSuccess {
            container.addView(ImageView(this).apply { setImageBitmap(it); adjustViewBounds = true })
        }.onFailure { showPlaceholder("PDF 렌더링 실패", it.message ?: "unknown") }
    }

    private fun addBody(textValue: String) {
        container.addView(TextView(this).apply {
            text = textValue
            textSize = 15f
            setTextColor(Color.rgb(45, 48, 66))
            setPadding(0, 12, 0, 0)
        })
    }

    private fun isOffice(lower: String): Boolean {
        return lower.endsWith(".doc") || lower.endsWith(".docx") || lower.endsWith(".xls") || lower.endsWith(".xlsx") || lower.endsWith(".ppt") || lower.endsWith(".pptx") || lower.endsWith(".odt") || lower.endsWith(".ods") || lower.endsWith(".odp")
    }

    private fun showPlaceholder(head: String, body: String) {
        container.addView(TextView(this).apply {
            text = "$head\n\n$body"
            textSize = 16f
            setTextColor(Color.rgb(65, 69, 95))
            setPadding(0, 16, 0, 0)
        })
    }
}
