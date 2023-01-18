let requests = [];

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.method === "POST") {
            const { formData } = details.requestBody
            //formData.continueがあればセクション途中。終了してない
            // console.log(formData)
            if ("continue" in formData) {
                console.log('まだ途中')
            } else {
                requests.push({ requestId: details.requestId, details: details })
            }

        }
    },
    { urls: ["*://docs.google.com/forms/u/0/d/e/*/formResponse"] },
    ['requestBody']
);

//完了後にstorageに保存する
chrome.webRequest.onCompleted.addListener(
    async function (tabs) {
        // console.log(requests)
        const data = requests.filter(v => v.requestId === tabs.requestId);
        if (data.length === 0) return;
        const path = data[0].details.url.match("/d\/e\/(.*?)\/(viewform|formResponse)")[1]
        const storedData = await new Promise(resolve => chrome.storage.sync.get([path], resolve))
        console.log(storedData)
        chrome.storage.sync.set({
            [path]: [{ ...data[0].details, ...storedData }]
        })
        requests = []
        // console.log(details)

    },
    { urls: ["*://docs.google.com/forms/u/0/d/e/*/formResponse"] },
    ['responseHeaders']
)