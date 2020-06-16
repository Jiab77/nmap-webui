# nmap-webui
A simple web interface for Nmap with a XML to JSON reports converter

## Dependencies

As most of the `nmap` features requires to be `root`, you will have to run this command to avoid the need to specify the password when the interface will invocate `nmap`.

```bash
# Authorize nmap to run as root without password
echo "$USER ALL = NOPASSWD: $(which nmap)" | sudo tee -a /etc/sudoers.d/nmap
```