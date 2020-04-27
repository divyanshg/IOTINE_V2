const dataCamp = require('./dataCamp').dataCamp

dataCamp.updateFeed('iub54i6bibu64', '', 'retg54', Math.floor(Math.random() * 100), res => {
    console.log(res)
})

dataCamp.getFeedValue('iub54i6bibu64', '', 'retg54', feed => {
    console.log(feed.value)
})