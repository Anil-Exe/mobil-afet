plugins {
    alias(libs.plugins.android.application)
    id("com.google.gms.google-services")
}


// Values stay in ignored api.local.properties or environment variables.
val privateApiProperties = java.util.Properties().apply {
    val privateFile = rootProject.file("api.local.properties")
    if (privateFile.isFile) privateFile.inputStream().use { load(it) }
}

fun localApiValue(name: String, defaultValue: String = ""): String {
    val value = System.getenv(name) ?: privateApiProperties.getProperty(name, defaultValue)
    return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
        .replace("\n", "\\n").replace("\r", "\\r") + "\""
}

android {
    buildFeatures { buildConfig = true }
    namespace = "com.example.mobilafet"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.mobilafet"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        buildConfigField("String", "NOTIFICATION_BACKEND_URL", localApiValue("NOTIFICATION_BACKEND_URL", "https://example.invalid/"))

        buildConfigField("String", "OPENWEATHER_API_KEY", localApiValue("OPENWEATHER_API_KEY"))
        buildConfigField("String", "OPENROUTESERVICE_API_KEY", localApiValue("OPENROUTESERVICE_API_KEY"))
        buildConfigField("String", "MAPTILER_API_KEY", localApiValue("MAPTILER_API_KEY"))
        buildConfigField("String", "FIRMS_API_KEY", localApiValue("FIRMS_API_KEY"))

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)

    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.retrofit2:converter-scalars:2.9.0")

    implementation(platform("com.google.firebase:firebase-bom:33.9.0"))
    implementation("com.google.firebase:firebase-auth")
    implementation("com.google.firebase:firebase-firestore")
    implementation("com.google.firebase:firebase-messaging")
    implementation("org.osmdroid:osmdroid-android:6.1.20")
}
