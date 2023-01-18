// 回答済みかの確認
const path = ["viewform", "closedform"]
if (path.includes(document.URL.split("/").slice(-1)[0])) {
    const path = getPath(document.URL)
    console.log(path)
    chrome.storage.sync.get([path], function (result) {
        if (!Object.keys(result).length) {
        } else {
            alert("既に回答しています。")
        }
    })
}

function getPath(url) {
    return url.match("/d\/e\/(.*?)\/(viewform|formResponse|closedform)")[1]
}