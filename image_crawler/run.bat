@echo off


rem Activate the Conda environment

cd "image_crawler"

rem Run the Scrapy Forest command
scrapy crawl upload_image -a tag=forest -o upload_forest.json

rem Run the Scrapy Landscape command
rem scrapy crawl upload_image -a tag=landscape -o upload_landscape.json

rem Run the Scrapy mountain command
rem scrapy crawl upload_image -a tag=mountain -o upload_mountain.json

rem Run the Scrapy nature command
rem scrapy crawl upload_image -a tag=nature -o upload_nature.json

rem Run the Scrapy seascape command
rem scrapy crawl upload_image -a tag=seascape -o upload_seascape.json

rem Run the Scrapy waterfall command
rem scrapy crawl upload_image -a tag=waterfall -o upload_waterfall.json

rem Run the Scrapy long exposure command
rem scrapy crawl upload_image -a tag=long_exposure -o upload_long_exposure.json