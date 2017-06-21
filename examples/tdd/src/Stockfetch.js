var fs = require('fs')
var https = require('https')

var Stockfetch = function () {
  this.readTickers = (filename, onError) => {
    var self = this

    var processResponse = (err, data) => {
      if (err) {
        onError('error reading file: ' + filename)
      } else {
        var tickers = self.parseTickers(data.toString())

        if (tickers.length === 0) {
          onError('file ' + filename + ' has invalid content')
        } else {
          self.processTickers(tickers)
        }
      }
    }

    fs.readFile(filename, processResponse)
  }

  this.parseTickers = (data) => {
    var format = (ticker) => {
      return ticker.trim().length !== 0 && ticker.indexOf(' ') < 0
    }
    return data.split('\n').filter(format)
  }

  this.processTickers = (tickers) => {
    var self = this

    self.tickerCount = tickers.length

    tickers.forEach(ticker => self.getPrice(ticker))
  }

  this.tickerCount = 0

  this.getPrice = (ticker) => {
    var self = this
    var url = 'https://www.google.com/finance/info?q=' + ticker
    self.https.get(url, self.processResponse.bind(self, ticker))
            .on('error', self.processHttpError.bind(self, ticker))
  }

  this.https = https

  this.processResponse = (ticker, response) => {
    var self = this
    if (response.statusCode === 200) {
      var data = ''
      response.on('data', chunk => { data += chunk })
      response.on('end', () => {
        var cleaned = self.cleanData(data)

        self.parsePrice(ticker, cleaned)
      })
    } else {
      self.processError(ticker, response.statusCode)
    }
  }
  this.cleanData = data => {
    var response = data.replace(/\//g, '')
    var parsed = JSON.parse(response)
    return parsed.pop()
  }

  this.processHttpError = (ticker, error) => {
    var self = this
    self.processError(ticker, error.code)
  }

  this.parsePrice = (ticker, data) => {
    var self = this
    var price = Number(data.l)
    self.prices[ticker] = price
    self.printReport()
  }

  this.printReport = () => {
    var self = this
    if (self.tickerCount === Object.keys(self.prices).length + Object.keys(self.errors).length) {
      self.reportCallback(self.sortData(self.prices), self.sortData(self.errors))
    }
  }

  this.processError = (ticker, error) => {
    var self = this
    self.errors[ticker] = error
    this.printReport()
  }

  this.prices = {}
  this.errors = {}

  this.reportCallback = () => {

  }

  this.sortData = (data) => {
    var toArray = key => [key, data[key]]

    return Object.keys(data).sort().map(toArray)
  }

  this.getPriceForTickers = (filename, display, error) => {
    var self = this
    self.reportCallback = display
    self.readTickers(filename, error)
  }
}

module.exports = Stockfetch
