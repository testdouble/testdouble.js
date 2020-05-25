function SavesProblem() {
}
SavesProblem.prototype.save = function(){
}

function MathProblem(createRandomProblem, savesProblem, submitProblem) {
  this.createRandomProblem = createRandomProblem
  this.savesProblem = savesProblem
  this.submitProblem = submitProblem
}
MathProblem.prototype.generate = function(){
  var problem = this.createRandomProblem(),
      savedProblem = this.savesProblem.save(problem)

  this.submitProblem(savedProblem)
  return 'neat'
}

var td = require('testdouble')

describe('MathProblem', function() {
  var subject, createRandomProblem, FakeSavesProblem, submitProblem;
  beforeEach(function(){
    createRandomProblem = td.function('createRandomProblem')
    FakeSavesProblem = td.constructor(SavesProblem)
    submitProblem = td.function('submitProblem')
    subject = new MathProblem(createRandomProblem, new FakeSavesProblem(), submitProblem)
  })
  it('POSTs a random problem', function(){
    td.when(createRandomProblem()).thenReturn('some problem')
    td.when(FakeSavesProblem.prototype.save('some problem')).thenReturn('saved problem')

    var result = subject.generate()

    td.verify(submitProblem('saved problem'))
    expect(result).toEqual('neat')
  })
})

describe('MathProblem (td.instance)', function() {
  var subject, createRandomProblem, submitProblem;
  beforeEach(function(){
    createRandomProblem = td.function('createRandomProblem')
    submitProblem = td.function('submitProblem')
    subject = new MathProblem(createRandomProblem, td.instance(SavesProblem), submitProblem)
  })
  it('POSTs a random problem', function() {
    td.when(createRandomProblem()).thenReturn('some problem')
    td.when(subject.savesProblem.save('some problem')).thenReturn('saved problem')

    var result = subject.generate()

    td.verify(submitProblem('saved problem'))
    expect(result).toEqual('neat')
  })
})
