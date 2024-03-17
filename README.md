# Fridgimon

Fridgimon started as a joke. Playing with a Zebra MC18 barcode scanner, I said I should write an app that keeps track of the contents of my fridge, reminding me when stuff goes out of date.
So I wrote an app that keeps track of the contents of my fridge, reminding me when stuff goes out of date.

Fridgimon is a webapp in React, with a PHP backend that talks to the database. It also contains the configuration to load this webapp in Zebra's [Enterprise Browser](https://techdocs.zebra.com/enterprise-browser/1-8/), a customised browser environment with full access to the device functionality including the barcode scanner.

* [Fridgimon repo](https://github.com/DeeHants/Fridgimon) on GitHub

## Installation

### Web application

1.  Create the database schema from `src/fridgimon.sql`.
2.  Copy `src/webapp/db.sample.inc.php` to `src/webapp/db.inc.php` and populate with your MySQL connection details.
3.  Setup an Apache vhost with the document root of `src/webapp`.
4.  Allow the `PUT` and `DELETE` methods for the `src/webapp/api` directory, either in the global apache config, or the vhost entry, e.g.
    ```
    <Location /api>
        AllowMethods GET POST PUT DELETE
        Require all granted
    </Location>
    ```
    (Note, you cannot add this to `.htaccess`)
5.  Open the browser and navigate to `http://yourhost/eb/`, and you should have a page with JS errors (as unable to access the barcode scanner).

### Enterprise Browser

(The instructions below assume a device running Android Lollipop that has been reset back to default, but can apply to WinCE with adjustments)

This will require copying files to your MC18 scanner, which can be done via a file manager app on the device itself, or by acquiring or fabricating a USB cable and using ADB and file MTP transfer.

1.  Update the `StartPage` entry in `src/EnterpriseBrowser/Config.xml` to point to your configured website address.
2. Backup the contents of `SD card\Android\data\com.symbol.enterprisebrowser` on the device.
3.  Copy the contents of `src/EnterpriseBrowser` to `SD card\Android\data\com.symbol.enterprisebrowser` on the device.
4.  Restart EnterpriseBrowser from the launcher, and it should load up to the Fridgimon app.

## Dependencies

* Apache 2.3+
* PHP 5.6+
* MySQL
* Zebra MC18 barcode scanner with EnterpriseBrowser 1.8

## Copyright

Licensed under the BSD 3-Clause License.
Code copyright (c) 2024, Deanna Earley.

