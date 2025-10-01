#!/bin/bash
echo "Creating unpacked directories for development..."

# 1. Build mã nguồn TypeScript
echo "Executing npm webpack script..."
npm run webpack

# 2. Xóa các thư mục build cũ và tạo lại cấu trúc thư mục "unpacked"
echo "Setting up directories..."
rm -rf chrome firefox edge
mkdir -p chrome/unpacked/dist
mkdir -p firefox/unpacked/dist
mkdir -p edge/unpacked/dist

# 3. Sao chép các file chung (icon và các file đã build trong 'dist')
echo "Copying shared assets..."
cp icon-48.png chrome/unpacked/
cp icon-48.png firefox/unpacked/
cp icon-48.png edge/unpacked/
cp dist/* chrome/unpacked/dist/
cp dist/* firefox/unpacked/dist/
cp dist/* edge/unpacked/dist/

# 4. Tạo file manifest.json riêng cho từng trình duyệt
echo "Generating browser-specific manifests..."
jq -s 'reduce .[] as $item ({}; . * $item)' manifest.partial.json manifest-chrome.partial.json > chrome/unpacked/manifest.json
jq -s 'reduce .[] as $item ({}; . * $item)' manifest.partial.json manifest-firefox.partial.json > firefox/unpacked/manifest.json
jq -s 'reduce .[] as $item ({}; . * $item)' manifest.partial.json manifest-edge.partial.json > edge/unpacked/manifest.json

echo ""
echo "Build complete!"
echo "You can now use the following directories with 'Load unpacked':"
echo " - Chrome: ./chrome/unpacked"
echo " - Firefox: ./firefox/unpacked"
echo " - Edge: ./edge/unpacked"