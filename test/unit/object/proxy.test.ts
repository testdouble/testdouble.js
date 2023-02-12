import proxy from '../../../src/object/proxy'
import when from '../../../src/when'
import explain from '../../../src/explain'
declare const assert : any // globally defined in test/helper.js for now

export interface User {
  id: string
  name: string | null
  postIDs: string[]
}

export interface Post {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
}

export interface Data {
  posts: Post[]
  users: User[]
  idProvider: () => string
}

export interface Context {
  data: Data
}

export default {
  'deeply-nested proxy objects can be typed nicely' () {
    const user = { id: 'some user', name: 'some name', postIDs: ['some post'] }
    const context = proxy<Context>('someContext')
    context.data.users = [user]
    when(context.data.idProvider()).thenReturn('some id provider')

    assert._isEqual(context.data.idProvider(), 'some id provider')
    assert._isEqual(explain(context.data.idProvider).name, 'someContext.data.idProvider')
    assert._isEqual(context.data.users[0].name, 'some name')
  }
}
