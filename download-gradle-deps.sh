#!/bin/bash
# Download Android Gradle Plugin 8.6.0 dependencies manually

CACHE_DIR="$HOME/.gradle/caches/modules-2/files-2.1"
BASE_URL="https://dl.google.com/dl/android/maven2"

# List of artifacts that failed (group/artifact/version/filename)
ARTIFACTS=(
  "com/android/tools/build/gradle/8.6.0/gradle-8.6.0.jar"
  "com/android/tools/build/builder/8.6.0/builder-8.6.0.jar"
  "com/android/tools/build/manifest-merger/31.6.0/manifest-merger-31.6.0.jar"
  "com/android/tools/sdk-common/31.6.0/sdk-common-31.6.0.jar"
  "com/android/tools/sdklib/31.6.0/sdklib-31.6.0.jar"
  "com/android/tools/repository/31.6.0/repository-31.6.0.jar"
  "com/android/tools/build/gradle-api/8.6.0/gradle-api-8.6.0.jar"
  "com/android/tools/ddms/ddmlib/31.6.0/ddmlib-31.6.0.jar"
  "com/android/tools/build/aaptcompiler/8.6.0/aaptcompiler-8.6.0.jar"
  "com/android/tools/build/bundletool/1.16.0/bundletool-1.16.0.jar"
  "com/android/tools/build/aapt2-proto/8.6.0-11315950/aapt2-proto-8.6.0-11315950.jar"
  "com/android/tools/analytics-library/shared/31.6.0/shared-31.6.0.jar"
  "androidx/databinding/databinding-compiler-common/8.6.0/databinding-compiler-common-8.6.0.jar"
  "com/android/tools/layoutlib/layoutlib-api/31.6.0/layoutlib-api-31.6.0.jar"
  "com/android/tools/utp/android-test-plugin-result-listener-gradle-proto/31.6.0/android-test-plugin-result-listener-gradle-proto-31.6.0.jar"
  "com/android/tools/build/builder-model/8.6.0/builder-model-8.6.0.jar"
  "com/android/tools/common/31.6.0/common-31.6.0.jar"
  "com/android/tools/build/apkzlib/8.6.0/apkzlib-8.6.0.jar"
  "com/android/tools/analytics-library/protos/31.6.0/protos-31.6.0.jar"
  "com/android/tools/build/apksig/8.6.0/apksig-8.6.0.jar"
)

DOWNLOAD_DIR="/tmp/gradle-deps"
mkdir -p "$DOWNLOAD_DIR"

echo "Downloading ${#ARTIFACTS[@]} artifacts..."
echo "This may take a while on slow connections."
echo ""

for artifact in "${ARTIFACTS[@]}"; do
  filename=$(basename "$artifact")
  url="$BASE_URL/$artifact"
  dest="$DOWNLOAD_DIR/$filename"

  if [ -f "$dest" ]; then
    echo "✓ Already downloaded: $filename"
  else
    echo "Downloading: $filename"
    # Use curl with resume support and longer timeout
    curl -L --connect-timeout 60 --max-time 600 -C - -o "$dest" "$url"
    if [ $? -eq 0 ]; then
      echo "✓ Downloaded: $filename"
    else
      echo "✗ Failed: $filename"
    fi
  fi
done

echo ""
echo "Downloads complete. Files are in: $DOWNLOAD_DIR"
echo ""
echo "Now run the build again - Gradle should find these in its cache"
echo "or we can manually copy them to the cache."
