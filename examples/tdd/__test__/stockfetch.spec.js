var td = require('testdouble')
var fs = require('fs')
var Stockfetch = require('../src/Stockfetch')

describe('stockfetch tests', function () {
  var stockfetch

  beforeEach(() => {
    stockfetch = new Stockfetch()
  })

  afterEach(() => {
    td.reset()
  })

  test('should pass this canary test', () => {
    test('we should be ready to go', () => {
      expect(true).toBe(true)
    })
  })

  test('read should invoke error handler for invalid file', done => {
    var onError = err => {
      expect(err).toEqual('error reading file: invalidfile')
      done()
    }

    td.replace(fs, 'readFile', (filename, callback) => {
      callback(new Error('failed'))
    })

    stockfetch.readTickers('invalidfile', onError)
  })

  test('read should invoke processTickers for valid file', done => {
    var rawData = 'GOOG\nAAPL\nTSLA\nMSFT'
    var parsedData = ['GOOG', 'AAPL', 'TSLA', 'MSFT']

    td.replace(stockfetch, 'parseTickers')
    td.when(stockfetch.parseTickers(rawData)).thenReturn(parsedData)

    td.replace(stockfetch, 'processTickers', (data) => {
      expect(data).toEqual(parsedData)
      done()
    })

    td.replace(fs, 'readFile', (filename, callback) => {
      callback(null, rawData)
    })

    stockfetch.readTickers('tickers.txt')
  })

  test('read should return error if given file is empty', done => {
    var onError = err => {
      expect(err).toEqual('file tickers.txt has invalid content')
      done()
    }

    td.replace(stockfetch, 'parseTickers')
    td.when(stockfetch.parseTickers('')).thenReturn([])

    td.replace(fs, 'readFile', (filename, callback) => {
      callback(null, '')
    })

    stockfetch.readTickers('tickers.txt', onError)
  })

  test('parseTickers should return tickers', () => {
    expect(stockfetch.parseTickers('a\nb\nc')).toEqual(['a', 'b', 'c'])
  })

  test('parseTickers should return empty array for empty content', () => {
    expect(stockfetch.parseTickers('')).toEqual([])
  })

  test('parseTickers should ignore unexpected format in content', () => {
    var rawData = 'AAPL \nBla h\nGOOG\n\n  '

    expect(stockfetch.parseTickers(rawData)).toEqual(['GOOG'])
  })

  test('processTickers should call getPrice for each ticker symbol', () => {
    td.replace(stockfetch, 'getPrice')

    stockfetch.processTickers(['a', 'b', 'c'])

    td.verify(stockfetch.getPrice('a'))
    td.verify(stockfetch.getPrice('b'))
    td.verify(stockfetch.getPrice('c'))
  })

  test('processTickers should save ticker count', () => {
    stockfetch.processTickers(['a', 'b', 'c'])

    expect(stockfetch.tickerCount).toEqual(3)
  })

  test('getPrice should call get on http wtesth valid URL', done => {
    td.replace(stockfetch.https, 'get', url => {
      expect(url).toEqual('https://www.google.com/finance/info?q=TSLA')
      done()
      return { on: () => {} }
    })

    stockfetch.getPrice('TSLA')
  })

  test('getPrice should send a response handler to get', done => {
    var ahandler = () => {}

    td.replace(stockfetch.processResponse, 'bind')
    td.when(stockfetch.processResponse.bind(stockfetch, 'TSLA')).thenReturn(ahandler)

    td.replace(stockfetch.https, 'get', (url, handler) => {
      expect(handler).toEqual(ahandler)
      done()
      return { on: () => {} }
    })

    stockfetch.getPrice('TSLA')
  })

  test('getPrice should register handler for failure to reach host', done => {
    var errorHandler = () => {}

    td.replace(stockfetch.processHttpError, 'bind')
    td.when(stockfetch.processHttpError.bind(stockfetch, 'TSLA')).thenReturn(errorHandler)

    var stub = (event, handler) => {
      expect(event).toEqual('error')
      expect(handler).toEqual(errorHandler)
      done()
    }

    td.replace(stockfetch.https, 'get', () => {
      return {
        on: stub
      }
    })

    stockfetch.getPrice('TSLA')
  })

  test('processResponse should call parsePrice with valid data', () => {
    var dataFunction
    var endFunction

    var response = {
      statusCode: 200,
      on: (event, handler) => {
        if (event === 'data') dataFunction = handler
        if (event === 'end') endFunction = handler
      }
    }

    td.replace(stockfetch, 'parsePrice')

    stockfetch.processResponse('TSLA', response)

    dataFunction('[{"hello": "people"}]')
    endFunction()

    td.verify(stockfetch.parsePrice('TSLA', {hello: 'people'}))
  })

  test('processResponse should call processError if response failed', () => {
    var response = { statusCode: 404 }

    td.replace(stockfetch, 'processError')

    stockfetch.processResponse('TSLA', response)

    td.verify(stockfetch.processError('TSLA', 404))
  })

  test('processResponse should call processError only if response failed', () => {
    var response = {
      statusCode: 200,
      on: () => {}
    }

    td.replace(stockfetch, 'processError')

    stockfetch.processResponse('TSLA', response)

    td.verify(stockfetch.processError(), {times: 0})
  })

  test('processHttpError should call processError wtesth error details', () => {
    var error = {code: '...error code...'}
    td.replace(stockfetch, 'processError')

    stockfetch.processHttpError('TSLA', error)

    td.verify(stockfetch.processError('TSLA', '...error code...'))
  })

  var data =
  { id: '12607212',
    t: 'TSLA',
    e: 'NASDAQ',
    l: '375.95',
    l_fix: '375.95',
    l_cur: '375.95',
    s: '1',
    ltt: '4:00PM EDT',
    lt: 'Jun 13, 4:00PM EDT',
    lt_dts: '2017-06-13T16:00:02Z',
    c: '+16.94',
    c_fix: '16.94',
    cp: '4.72',
    cp_fix: '4.72',
    ccol: 'chg',
    pcls_fix: '359.01',
    el: '379.70',
    el_fix: '379.70',
    el_cur: '379.70',
    elt: 'Jun 14, 8:03AM EDT',
    ec: '+3.75',
    ec_fix: '3.75',
    ecp: '1.00',
    ecp_fix: '1.00',
    eccol: 'chg',
    div: '',
    yld: '' }

  test('clean data should clean data from response', () => {
    var rawData = '// [ { "id": "226108333179804" ,"t" : "YELP" ,"e" : "NYSE" ,"l" : "30.72" ,"l_fix" : "30.72" ,"l_cur" : "30.72" ,"s": "2" ,"ltt":"4:02PM EDT" ,"lt" : "Jun 13, 4:02PM EDT" ,"lt_dts" : "2017-06-13T16:02:57Z" ,"c" : "0.00" ,"c_fix" : "0.00" ,"cp" : "0.00" ,"cp_fix" : "0.00" ,"ccol" : "chb" ,"pcls_fix" : "30.72" ,"el": "30.72" ,"el_fix": "30.72" ,"el_cur": "30.72" ,"elt" : "Jun 13, 4:02PM EDT" ,"ec" : "0.00" ,"ec_fix" : "0.00" ,"ecp" : "0.00" ,"ecp_fix" : "0.00" ,"eccol" : "chb" ,"div" : "" ,"yld" : "" } ]'
    var cleanData = {
      id: '226108333179804',
      t: 'YELP',
      e: 'NYSE',
      l: '30.72',
      l_fix: '30.72',
      l_cur: '30.72',
      s: '2',
      ltt: '4:02PM EDT',
      lt: 'Jun 13, 4:02PM EDT',
      lt_dts: '2017-06-13T16:02:57Z',
      c: '0.00',
      c_fix: '0.00',
      cp: '0.00',
      cp_fix: '0.00',
      ccol: 'chb',
      pcls_fix: '30.72',
      el: '30.72',
      el_fix: '30.72',
      el_cur: '30.72',
      elt: 'Jun 13, 4:02PM EDT',
      ec: '0.00',
      ec_fix: '0.00',
      ecp: '0.00',
      ecp_fix: '0.00',
      eccol: 'chb',
      div: '',
      yld: '' }

    expect(stockfetch.cleanData(rawData)).toEqual(cleanData)
  })

  test('parsePrice should update prices', () => {
    stockfetch.parsePrice('TSLA', data)

    expect(stockfetch.prices.TSLA).toEqual(375.95)
  })

  test('parsePrice should call printReport', () => {
    td.replace(stockfetch, 'printReport')

    stockfetch.parsePrice('TSLA', data)

    td.verify(stockfetch.printReport())
  })

  test('processError should update errors', () => {
    stockfetch.processError('TSLA', 'error')

    expect(stockfetch.errors.TSLA).toEqual('error')
  })

  test('processError should call print report', () => {
    td.replace(stockfetch, 'printReport')

    stockfetch.processError('TSLA', 'error')

    td.verify(stockfetch.printReport())
  })

  test('printReport should send price, errors once all responses arrive', () => {
    stockfetch.prices = { 'AAPL': 12.98 }
    stockfetch.errors = { 'GOOG': 'error' }
    stockfetch.tickerCount = 2

    td.replace(stockfetch, 'reportCallback')

    stockfetch.printReport()

    td.verify(stockfetch.reportCallback([['AAPL', 12.98]], [['GOOG', 'error']]))
  })

  test('printReport should not send before all responses arrive', () => {
    stockfetch.prices = { 'AAPL': 12.98 }
    stockfetch.errors = { 'GOOG': 'error' }
    stockfetch.tickerCount = 3

    td.replace(stockfetch, 'reportCallback')

    stockfetch.printReport()

    td.verify(stockfetch.reportCallback([['AAPL', 12.98]], [['GOOG', 'error']]), {times: 0})
  })

  test('printReport should call sortData once for prices, once for errors', () => {
    stockfetch.prices = { 'AAPL': 12.98 }
    stockfetch.errors = { 'GOOG': 'error' }
    stockfetch.tickerCount = 2

    td.replace(stockfetch, 'sortData')

    stockfetch.printReport()

    td.verify(stockfetch.sortData(stockfetch.prices))
    td.verify(stockfetch.sortData(stockfetch.errors))
  })

  test('sortData should sort the data based on ticker symbols', () => {
    var data = {
      'GOOG': 1.2,
      'AAPL': 2.1
    }

    var result = stockfetch.sortData(data)

    expect(result).toEqual([['AAPL', 2.1], ['GOOG', 1.2]])
  })
})

describe('integration tests for stockfetch', () => {
  var stockfetch

  beforeEach(() => {
    stockfetch = new Stockfetch()
  })

  afterEach(() => {
    td.reset()
  })

  test('getPriceForTickers should report error for invalid file', done => {
    var onError = error => {
      expect(error).toEqual('error reading file: invalidfile')
      done()
    }

    var display = () => {}

    stockfetch.getPriceForTickers('invalidfile', display, onError)
  })

  test('getPriceForTickers should respond well for a valid file', done => {
    var onError = td.func()

    var display = (prices, errors) => {
      expect(prices.length).toEqual(5)
      expect(errors.length).toEqual(1)
      td.verify(onError(), { times: 0 })
      done()
    }

    stockfetch.getPriceForTickers('tickers.txt', display, onError)
  }, 90000)
})
