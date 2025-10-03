# CPH-Submit

![Icon](icon-48.png)

This is a forked and enhanced version of [cph-submit](https://github.com/agrawal-d/cph), a browser extension that enables direct submission to Codeforces from the [Competitive Programming Helper (cph)](https://github.com/agrawal-d/cph) VS Code extension.

This fork includes significant improvements over the original version, including:
-   **Microsoft Edge Support**: Full compatibility with Microsoft Edge.
-   **Codeforces Gym Support**: Correctly handles submissions for problems in Codeforces Gyms, including private ones.
-   **Enhanced Reliability**: The submission logic has been completely refactored to be more robust. It is now resilient to race conditions, Cloudflare bot checks, and other page loading delays.

## Supported Browsers

-   Mozilla Firefox
-   Google Chrome
-   Microsoft Edge

## Development Setup

Follow these instructions to build the extension from the source code and install it for development or personal use.

### Prerequisites

1.  **Node.js and npm**: Required for managing dependencies and running build scripts. You can download them [here](https://nodejs.org/).
2.  **jq**: A command-line JSON processor used by the build script to merge manifest files. Download it [here](https://jqlang.github.io/jq/download/).
3.  **Git Bash (for Windows users)**: The build script is a shell script (`.sh`). To run it on Windows, you need a compatible command-line environment like Git Bash, which is typically included with the [Git for Windows](https://git-scm.com/download/win) installation.

### Build Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ju5T1N-VN/cph-submit.git
    cd cph-submit
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the build script:**
    ```bash
    ./create-zip.sh
    ```
    This command compiles the TypeScript source code and creates ready-to-install "unpacked" extension directories for each browser:
    -   `chrome/unpacked/`
    -   `firefox/unpacked/`
    -   `edge/unpacked/`

## How to Install the Unpacked Extension

After building the project, you can load the extension directly into your browser for testing.

### For Google Chrome & Microsoft Edge

1.  Open your browser and navigate to the extensions page:
    -   Chrome: `chrome://extensions`
    -   Edge: `edge://extensions`
2.  Enable **"Developer mode"** (usually a toggle switch on the page).
3.  Click the **"Load unpacked"** button.
4.  In the file dialog, select the appropriate `unpacked` directory for your browser (e.g., `.../cph-submit/edge/unpacked`).
5.  The extension will be installed and activated.

**To update the extension after making code changes:** Simply run the build script again (`./create-zip.sh`) and then click the "Reload" button (a circular arrow icon) on the extension's card in the `edge://extensions` page.

### For Mozilla Firefox

1.  Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2.  Click the **"Load Temporary Add-on..."** button.
3.  Navigate into the `.../cph-submit/firefox/unpacked/` directory.
4.  Select the **`manifest.json`** file inside that directory.
5.  The add-on will be installed temporarily and will remain active until you close Firefox. To update, simply remove the old one and load the new `manifest.json` file again.

## Usage

Once installed, simply keep your browser open. When you trigger a submit action from the CPH extension in VS Code, a new tab will automatically open in your browser, fill in all the details, and submit your solution.

## Contributing

Contributions are welcome. Please open an issue to discuss any changes.

## Support

This fork is done by vibe-coding, so it may have issues. If you encounter any issues, please create an issue on this GitHub repository.