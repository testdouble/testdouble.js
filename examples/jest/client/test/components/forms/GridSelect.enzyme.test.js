// @flow
import React from 'react'
import td from 'testdouble'

describe('GridSelect enzyme', () => {
  it('can stub', () => {
    let honk = td.when(td.func()('hit')).thenReturn('beep')

    expect(honk('hit')).toEqual('beep')
  })
})
