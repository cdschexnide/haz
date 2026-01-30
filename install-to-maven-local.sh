#!/bin/bash
# Install downloaded JARs to local Maven repository

DOWNLOAD_DIR="/tmp/gradle-deps"
M2_REPO="$HOME/.m2/repository"

install_jar() {
  local group=$1
  local artifact=$2
  local version=$3
  local filename=$4

  local group_path=$(echo "$group" | tr '.' '/')
  local dest_dir="$M2_REPO/$group_path/$artifact/$version"

  mkdir -p "$dest_dir"

  if [ -f "$DOWNLOAD_DIR/$filename" ]; then
    cp "$DOWNLOAD_DIR/$filename" "$dest_dir/"
    # Create minimal POM
    cat > "$dest_dir/$artifact-$version.pom" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>$group</groupId>
  <artifactId>$artifact</artifactId>
  <version>$version</version>
</project>
EOF
    echo "✓ Installed: $artifact-$version"
  else
    echo "✗ Not found: $filename"
  fi
}

echo "Installing JARs to local Maven repository..."

install_jar "com.android.tools.build" "gradle" "8.6.0" "gradle-8.6.0.jar"
install_jar "com.android.tools.build" "builder" "8.6.0" "builder-8.6.0.jar"
install_jar "com.android.tools.build" "manifest-merger" "31.6.0" "manifest-merger-31.6.0.jar"
install_jar "com.android.tools" "sdk-common" "31.6.0" "sdk-common-31.6.0.jar"
install_jar "com.android.tools" "sdklib" "31.6.0" "sdklib-31.6.0.jar"
install_jar "com.android.tools" "repository" "31.6.0" "repository-31.6.0.jar"
install_jar "com.android.tools.build" "gradle-api" "8.6.0" "gradle-api-8.6.0.jar"
install_jar "com.android.tools.ddms" "ddmlib" "31.6.0" "ddmlib-31.6.0.jar"
install_jar "com.android.tools.build" "aaptcompiler" "8.6.0" "aaptcompiler-8.6.0.jar"
install_jar "com.android.tools.build" "bundletool" "1.16.0" "bundletool-1.16.0.jar"
install_jar "com.android.tools.build" "aapt2-proto" "8.6.0-11315950" "aapt2-proto-8.6.0-11315950.jar"
install_jar "com.android.tools.analytics-library" "shared" "31.6.0" "shared-31.6.0.jar"
install_jar "androidx.databinding" "databinding-compiler-common" "8.6.0" "databinding-compiler-common-8.6.0.jar"
install_jar "com.android.tools.layoutlib" "layoutlib-api" "31.6.0" "layoutlib-api-31.6.0.jar"
install_jar "com.android.tools.utp" "android-test-plugin-result-listener-gradle-proto" "31.6.0" "android-test-plugin-result-listener-gradle-proto-31.6.0.jar"
install_jar "com.android.tools.build" "builder-model" "8.6.0" "builder-model-8.6.0.jar"
install_jar "com.android.tools" "common" "31.6.0" "common-31.6.0.jar"
install_jar "com.android.tools.build" "apkzlib" "8.6.0" "apkzlib-8.6.0.jar"
install_jar "com.android.tools.analytics-library" "protos" "31.6.0" "protos-31.6.0.jar"
install_jar "com.android.tools.build" "apksig" "8.6.0" "apksig-8.6.0.jar"

echo ""
echo "Done! Now add mavenLocal() to android/build.gradle repositories."
