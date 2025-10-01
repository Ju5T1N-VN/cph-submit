# ![ICON](icon-48.png) cph-submit

Tiện ích trình duyệt cho phép nộp bài trực tiếp lên Codeforces từ [Competitive Programming Helper (cph)](https://github.com/agrawal-d/cph).

## Hỗ trợ các trình duyệt

-   **Mozilla Firefox**
-   **Google Chrome**
-   **Microsoft Edge**

## Cài đặt (Từ Cửa hàng)

Bạn có thể cài đặt phiên bản ổn định từ các cửa hàng tiện ích chính thức:

-   [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/cph-submit/)
-   [Google Chrome](https://chromewebstore.google.com/detail/cph-submit/ekplnobooikgpdbobcciehbhcmlklgnc)
-   *Sắp có trên Microsoft Edge Add-ons*

Sau khi cài đặt, hãy đảm bảo trình duyệt của bạn đang mở khi bạn muốn nộp bài từ cph trong VS Code.

## Thiết lập Môi trường Phát triển

Nếu bạn muốn đóng góp hoặc tự build extension từ mã nguồn, hãy làm theo các bước sau.

### Yêu cầu Công cụ

1.  **Node.js và npm**: Cần thiết để quản lý các gói phụ thuộc và chạy các script.
2.  **jq**: Một công cụ dòng lệnh để xử lý JSON. Script build dùng `jq` để gộp các file manifest. Bạn có thể tải về tại [đây](https://jqlang.github.io/jq/download/).
3.  **Git Bash (Đối với người dùng Windows)**: File build `create-zip.sh` là một shell script. Để chạy nó trên Windows, bạn cần một môi trường dòng lệnh tương thích như Git Bash (thường được cài đặt cùng với Git cho Windows).

### Các bước thực hiện

1.  **Clone repository về máy:**
    ```bash
    git clone https://github.com/agrawal-d/cph-submit.git
    cd cph-submit
    ```

2.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

3.  **Chạy script build cho môi trường phát triển:**
    ```bash
    ./create-zip.sh
    ```
    Lệnh này sẽ biên dịch mã nguồn TypeScript và tạo ra các thư mục `chrome/unpacked`, `firefox/unpacked`, và `edge/unpacked`. Mỗi thư mục này chứa một phiên bản đầy đủ của extension, sẵn sàng để được cài đặt thủ công.

## Cài đặt Tiện ích để Thử nghiệm (Load Unpacked)

Sau khi chạy script build, bạn có thể cài đặt extension vào trình duyệt để kiểm tra.

### Dành cho Google Chrome và Microsoft Edge

1.  Mở trình duyệt và truy cập `chrome://extensions` (cho Chrome) hoặc `edge://extensions` (cho Edge).
2.  Bật **"Chế độ nhà phát triển" (Developer mode)**.
3.  Nhấp vào nút **"Tải phần mở rộng đã giải nén" (Load unpacked)**.
4.  Chọn thư mục `unpacked` tương ứng (ví dụ: `.../cph-submit/edge/unpacked`).
5.  Tiện ích sẽ được cài đặt và kích hoạt.

### Dành cho Mozilla Firefox

1.  Mở Firefox và truy cập `about:debugging#/runtime/this-firefox`.
2.  Nhấp vào **"Tải Tiện ích Bổ sung Tạm thời..." (Load Temporary Add-on...)**.
3.  Trỏ đến thư mục `.../cph-submit/firefox/unpacked/`.
4.  Chọn file **`manifest.json`** bên trong thư mục đó.
5.  Tiện ích sẽ được cài đặt tạm thời cho đến khi bạn đóng trình duyệt.

## Đóng góp

Mọi sự đóng góp đều được chào đón.

## Hỗ trợ

Vui lòng tạo một "issue" trên GitHub nếu bạn cần hỗ trợ.