plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android { namespace = "com.docuview.hwp"; compileSdk = 35
    defaultConfig { applicationId = "com.docuview.hwp.nativeviewer"; minSdk = 23; targetSdk = 35; versionCode = 13; versionName = "0.5.3-smooth-pan" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
}

kotlin { jvmToolchain(17) }
