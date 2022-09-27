#!/bin/bash

/usr/bin/chromium-browser --kiosk --enable-kiosk-mode --enabled --touch-events --touch-events-ui --disable-ipv6 --allow-file-access-from-files --disable-java --disable-restore-session-state --disable-sync --disable-translate --disk-cache-size=1 --media-cache-size=1 "http://localhost:3000"