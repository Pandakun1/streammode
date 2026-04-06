local STREAM_URL = "http://127.0.0.1:3000/frame"

RegisterCommand("livestream", function(source)
    local src = source

    if src == 0 then return end

    CreateThread(function()
        while true do
            exports.screencapture:serverCapture(src, {
                encoding = "webp",
                quality = 0.6
            }, function(data)
                if not data then return end

                local TOKEN = "pandastream"

                PerformHttpRequest(STREAM_URL .. "?token=" .. TOKEN, function() end, "POST", data, {
                    ["Content-Type"] = "application/octet-stream"
                })
            end, "blob")

            Wait(200) -- ~5 FPS
            --Wait(100) -- ~10 FPS
            --Wait(66) -- ~15 FPS
            --Wait(50) -- ~20 FPS
            --Wait(40) -- ~25 FPS
            --Wait(33) -- ~30 FPS
        end
    end)
end, false)