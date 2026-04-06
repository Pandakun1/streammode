local activeStreams = {}

RegisterNetEvent("pandastream:server:streamFrame")
AddEventHandler("pandastream:server:streamFrame", function(targetSrc, WaitTime)
    local src = targetSrc
    if activeStreams[src] then
        print("Stream läuft bereits für ID: " .. src)
        return
    end

    activeStreams[src] = true
    print("Stream gestartet für ID: " .. src)

    CreateThread(function()
        while GetPlayerName(src) and activeStreams[src] do
            exports.screencapture:remoteUpload(src, "http://127.0.0.1:3000/frame?token=pandastream", {
                encoding = "webp",
                quality = 0.6
            }, function(data)
            end, "blob")

            Wait(WaitTime) -- 5 FPS sind für die Serverlast meistens völlig ausreichend

        end
        
        activeStreams[src] = nil
        print("Stream beendet für ID: " .. src)
    end)
end)

-- Befehl zum Starten
RegisterCommand("livestream", function(source, args, rawCommand)
    local fpsrange = {5, 10, 15, 20, 25, 30}
    local fps = args[1]
    if fps then
        for _, validFps in ipairs(fpsrange) do
            if tonumber(fps) == validFps then
                fps = validFps
                break
            end
        end
        local waitTime = 1000 / tonumber(fps)
        if waitTime and waitTime > 0 then
            TriggerEvent("pandastream:server:streamFrame", source, waitTime)
        else
            print("Ungültige Framerate. Bitte eine gültige Framerate angeben. Beispiel: /livestream 5 - 30 FPS in 5er Schritten möglich.")
        end
    else
        print("Bitte die Framerate angeben. Beispiel: /livestream 5 - 30 FPS in 5er Schritten möglich.")
    end
end, false)

-- Befehl zum Stoppen (optional aber empfohlen)
RegisterCommand("stopstream", function(source)
    activeStreams[source] = nil
end, false)