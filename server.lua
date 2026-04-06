RegisterCommand("livestream", function(source, args)
    local src = source
    if args[1] == "start" then
        print("Livestream gestartet von Source:", src)
        -- Event an Client senden
        TriggerClientEvent("streammode:startStream", src, {
            serverEndpoint = "http://127.0.0.1:3000/frame",
            uploadToken = "pandastream",
            formField = "file"
        })
    elseif args[1] == "stop" then
        print("Livestream gestoppt")
        TriggerClientEvent("streammode:stopStream", src)
    else
        print("Ungültiges Argument, benutze: /livestream start|stop")
    end
end, false)