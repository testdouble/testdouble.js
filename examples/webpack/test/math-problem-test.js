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
}

var td = require('testdouble')
describe('MathProblem', function(){
  var subject, createRandomProblem, savesProblem, submitProblem;
  beforeEach(function(){
    createRandomProblem = td.function('createRandomProblem')
    savesProblem = td.object(SavesProblem)
    submitProblem = td.function('submitProblem')
    subject = new MathProblem(createRandomProblem, savesProblem, submitProblem)
  })
  it('POSTs a random problem', function(){
    td.when(createRandomProblem()).thenReturn('some problem')
    td.when(savesProblem.save('some problem')).thenReturn('saved problem')

    subject.generate()

    td.verify(submitProblem('saved problem'))
  })
})
