# Globproxy

## Setup

```bash
GOOS=linux GOARCH=amd64 go build -a -o globproxy
chmod +x globproxy
tmux new -s globproxy
stdbuf -o 0 ./globproxy "0.0.0.0:8082" | sudo tee -a globproxy-access.log
```

First, press `Ctrl` and `B` simultaneously and afterwards `Shift` and `.` simultaneously.

Write `"detach"` in the command prompt

To attach again do

```bash
tmux ls
tmux a -t globproxy
```
