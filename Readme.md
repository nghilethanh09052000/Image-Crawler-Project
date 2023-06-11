# Setup Enviroments

## I. Install Python:

1.  Visit the official Python website at python.org and navigate to the Downloads section.
2.  Choose the appropriate Python version for your operating system. If you are unsure, it is recommended to select the latest stable version.
3.  Click on the download link for your operating system (Windows, macOS, or Linux) and download the installer.

## II. Download and install Visual Studio Code:

1.  Visit the official VSCode website at code.visualstudio.com.
2.  Click on the "Download" button, and the website will automatically detect your operating system and display the appropriate download link.
3.  Click on the download link for your operating system (Windows, macOS, or Linux) and download the installer.

## III. Install Conda:

1.  Install Miniconda or Anaconda:

. Visit the official Miniconda website at docs.conda.io/en/latest/miniconda.html.
. Download the installer for your operating system (Windows, macOS, or Linux).
. Double-click on the installer and follow the prompts to install Miniconda.

<i>Note: If you prefer Anaconda, you can download the installer from the official Anaconda website instead</i>

2.  Open a terminal or command prompt:
    . On Windows, you can open the Anaconda Prompt or the Command Prompt.
    . On macOS/Linux, you can open the Terminal application.

## IV. Setup Conda Environment:

1.  Install Visual Studio Code and Python (if you haven't already) by following the steps mentioned in the previous instructions.
2.  Launch VSCode on your computer.
3.  Open a new terminal within VSCode by selecting View from the menu and then choosing Terminal, or by using the keyboard shortcut Ctrl+ backtick (`).
4.  In the terminal, ensure that you have Conda installed by running the following command:
    `conda --version`
    <i>(If Conda is not recognized, make sure to install Miniconda or Anaconda by following the instructions in the previous section.)</i>

## V. Install Docker:

1.  Visit the Docker website at www.docker.com/get-started and click on the "Download Docker Desktop" button.
2.  Follow the prompts in the installer to proceed with the installation. During the installation, you may be prompted to enable Hyper-V, which is required for Docker to run on Windows. Allow the necessary system changes if prompted.
3.  Please make sure to follow the doc about installing docker on your PC
4.  Once the installation is complete, Docker Desktop will launch automatically. You should see the Docker icon in your system tray.

## VI. Install MongoDB:

1.  Visit the MongoDB website at www.mongodb.com/try/download/community and click on the "Download" button under the "Community Server" tab.
2.  During the installation, make sure to select the option to "Install MongoDB Compass," which is a graphical tool for managing MongoDB.
3.  Following the instruction on the website
4.  Once the installation is complete, MongoDB is ready to use.

# Setup and Run The Project

## I. Clone or download this repo:

1.  On your terminal or cmd, type `git clone git@github.com:nghilethanh09052000/Image-Crawler-Project.git`
2.  Checkout the image_crawler branch by typing `git checkout image_crawler`

## II. Run the Image Crawler Project:

1.  On you command line, run the command `pip install -r requirements.txt` to download the necessary python package
2.  After that navigate to the image_crawler folder by typing the command: `cd image_crawler`
3.  Run the Project:

a. For Flickr, Pexels, Unsplash: you can simply run by the following structure <b>scrapy crawl {name} -a tag={tag_name}</b>, for example:

    `scrapy crawl flickr -a tag=landscape`
    `scrapy crawl pexels -a tag=landscape`
    `scrapy crawl unsplash -a tag=landscape`


<i>(Just replace the name of tag you want to crawl)</i>

b. For Pixabay, you need a fast computer because of using docker, it will be taken up a lot of space on your computer
i. Open the second terminal
ii. Navigate to the flare_solver folder by typing `cd flare_solver`
iii. Run `docker-compose up` and wait untill it finish the host name
iv. Open the first terminal, read the instruction 3a above to start the crawling process
