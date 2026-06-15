plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android { namespace = "com.docuview.hwp"; compileSdk = 35
    defaultConfig { applicationId = "com.docuview.hwp.nativeviewer"; minSdk = 23; targetSdk = 35; versionCode = 14; versionName = "0.5.4-interaction-polish" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}

kotlin { jvmToolchain(17) }
