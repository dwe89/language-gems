# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ===== CAPACITOR WEBVIEW RULES =====
# Keep JavaScript interface classes - REQUIRED for Capacitor
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }

# Keep plugin classes
-keep class * extends com.getcapacitor.Plugin { *; }

# ===== WEBVIEW RULES =====
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String);
}

# ===== DEBUGGING RULES =====
# Preserve line numbers for debugging crash reports
-keepattributes SourceFile,LineNumberTable

# Hide the original source file name in stack traces
-renamesourcefileattribute SourceFile

# ===== GENERAL SECURITY =====
# Remove logging in release builds for security
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep annotations
-keepattributes *Annotation*

# ===== KOTLIN =====
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**

# ===== OKHTTP (if used by plugins) =====
-dontwarn okhttp3.**
-dontwarn okio.**
