plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android { namespace = "com.docuview.hwp"; compileSdk = 23
    buildToolsVersion = "29.0.3"
    defaultConfig { applicationId = "com.docuview.hwp"; minSdk = 23; targetSdk = 23; versionCode = 1; versionName = "0.1.0" }
}
