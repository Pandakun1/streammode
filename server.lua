-- Streammode CaptureStream (WebM) für FiveM
local livestreamActive = false
local uploadToken = "pandastream" -- Token für Node Server Upload
local serverEndpoint = "http://127.0.0.1:3000" -- Node Server URL
local formField = "file" -- optional, Name des FormData Feldes

-- Command /livestream
RegisterCommand("livestream", function(source, args)
    local src = source

    if args[1] == "start" then
        if livestreamActive then
            print("Livestream läuft bereits")
            return
        end

        livestreamActive = true
        print("Livestream gestartet von Source:", src)

        -- Trigger NUI auf Client-Seite
        TriggerClientEvent("streammode:startNuiStream", src, serverEndpoint, uploadToken, formField)

    elseif args[1] == "stop" then
        if not livestreamActive then
            print("Livestream ist nicht aktiv")
            return
        end

        livestreamActive = false
        print("Livestream gestoppt von Source:", src)

        -- Stoppe captureStream NUI
        TriggerClientEvent("streammode:stopNuiStream", src)
    else
        print("Ungültiges Argument: /livestream start|stop")
    end
end, false)