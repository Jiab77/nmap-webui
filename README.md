# nmap-webui
A simple web interface for Nmap with a XML to JSON reports converter

## Dependencies

As most of the `nmap` features requires to be `root`, you will have to run this command to avoid the need to specify the password when the interface will invocate `nmap`.

```bash
# Authorize nmap to run as root without password
echo "$USER ALL = NOPASSWD: $(which nmap)" | sudo tee -a /etc/sudoers.d/nmap
```

## Preview

### Light theme

![image](https://user-images.githubusercontent.com/9881407/84726211-ab278e80-af8c-11ea-8713-0def6c51e648.png)

### Dark theme

![image](https://user-images.githubusercontent.com/9881407/84726262-c5fa0300-af8c-11ea-942a-59195634107f.png)

## Usage

1. Start minimal web server

```bash
node server.js
```

2. Start API web server

```bash
# For PHP:
php -S localhost:8000 server.php

# For NodeJS:
# TODO
```
