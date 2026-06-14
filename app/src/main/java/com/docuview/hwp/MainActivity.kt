package com.docuview.hwp

import android.app.*
import android.os.*
import android.content.*
import android.net.Uri
import android.graphics.*
import android.graphics.pdf.PdfRenderer
import android.view.*
import android.widget.*
import java.io.*

class MainActivity : Activity() {
    private lateinit var container: LinearLayout
    override fun onCreate(savedInstanceState: Bundle?) { super.onCreate(savedInstanceState); buildUi(); handleIntent(intent) }
    override fun onNewIntent(intent: Intent) { super.onNewIntent(intent); handleIntent(intent) }
    private fun buildUi() {
        container = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(28,28,28,28); setBackgroundColor(Color.rgb(248,249,255)) }
        val title = TextView(this).apply { text="DocuView HWP"; textSize=28f; setTextColor(Color.rgb(35,36,55)); typeface=Typeface.DEFAULT_BOLD }
        val sub = TextView(this).apply { text="HWP/HWPX · PDF · TXT · Office 문서 통합 뷰어 MVP"; textSize=15f; setTextColor(Color.rgb(90,94,120)); setPadding(0,8,0,20) }
        val pick = Button(this).apply { text="문서 열기"; setOnClickListener { startActivityForResult(Intent(Intent.ACTION_OPEN_DOCUMENT).apply { addCategory(Intent.CATEGORY_OPENABLE); type="*/*" }, 10) } }
        container.addView(title); container.addView(sub); container.addView(pick); setContentView(ScrollView(this).apply { addView(container) })
    }
    override fun onActivityResult(requestCode:Int,resultCode:Int,data:Intent?) { super.onActivityResult(requestCode,resultCode,data); if(requestCode==10&&resultCode==RESULT_OK) data?.data?.let{ render(it) } }
    private fun handleIntent(i: Intent?) { i?.data?.let { render(it) } }
    private fun render(uri: Uri) {
        container.removeViews(3, container.childCount-3)
        val name = uri.lastPathSegment ?: uri.toString()
        container.addView(TextView(this).apply { text="열린 문서: $name"; textSize=18f; setTextColor(Color.rgb(35,36,55)); setPadding(0,18,0,10); typeface=Typeface.DEFAULT_BOLD })
        val lower=name.lowercase()
        when {
            lower.endsWith(".pdf") -> renderPdf(uri)
            lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv") -> renderText(uri)
            lower.endsWith(".hwp") || lower.endsWith(".hwpx") -> showPlaceholder("HWP/HWPX 미리보기 슬롯", "MVP에서는 파일 인식·열기 진입까지 구현했습니다. 다음 단계는 HWP/HWPX 파서 또는 서버 변환기를 연결해 페이지 렌더링을 완성합니다.")
            else -> showPlaceholder("범용 문서 미리보기 슬롯", "이 형식은 다음 단계에서 변환/렌더링 엔진을 연결합니다. 우선 Android 공유/열기 대상과 파일 정보 표시를 지원합니다.")
        }
    }
    private fun renderText(uri: Uri) { runCatching { contentResolver.openInputStream(uri)?.bufferedReader()?.readText()?.take(50000) }.onSuccess { container.addView(TextView(this).apply { text=it ?: ""; textSize=15f; setTextColor(Color.rgb(45,48,66)) }) }.onFailure { showPlaceholder("텍스트 읽기 실패", it.message ?: "unknown") } }
    private fun renderPdf(uri: Uri) { runCatching { val pfd=contentResolver.openFileDescriptor(uri,"r")!!; val renderer=PdfRenderer(pfd); val page=renderer.openPage(0); val bmp=Bitmap.createBitmap(page.width*2,page.height*2,Bitmap.Config.ARGB_8888); page.render(bmp,null,null,PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY); page.close(); renderer.close(); pfd.close(); bmp }.onSuccess { container.addView(ImageView(this).apply { setImageBitmap(it); adjustViewBounds=true }) }.onFailure { showPlaceholder("PDF 렌더링 실패", it.message ?: "unknown") } }
    private fun showPlaceholder(head:String, body:String) { container.addView(TextView(this).apply { text="$head\n\n$body"; textSize=16f; setTextColor(Color.rgb(65,69,95)); setPadding(0,16,0,0) }) }
}
