function dfs(final_path, AR_result, node_start, receiver) {
    var is_in = 0;
    // debugger;
    //找final_path里还有没有node_start
    for (let i = 0; i <= final_path.length - 1; i++) {
        if (final_path[i].indexOf(node_start) !== -1) {
            is_in = 1;
            
            break;
        }
    }
   
    if (is_in === 0) {
        AR_result.pop();
        return;
    }
    

    for (let i = 0; i <= final_path.length - 1; i++) {
        if (final_path[i].indexOf(node_start) != -1) {
            //算对应的end_node
            var end_node = final_path[i].filter((node) => {
                return node.indexOf(node_start) === -1
            });
            //删掉next_path在final_path中的这一行
            AR_result.push(final_path[i]);
            final_path[i]=[0,0];
            if (end_node[0] === receiver) {
                final_result=AR_result.slice(0,AR_result.length);
                console.log(final_result);
                break;
            }
            dfs(final_path, AR_result, end_node[0], receiver);
            
        }
    }
    AR_result.pop();
    

}



var final_path = [['F','I'], ['A', 'B'], ['A', 'C'], ['F','H'], ['I', 'R'], ['C', 'F'], ['B', 'D'], ['B', 'G'], ['B', 'E']];
// var final_path=[['A', 'B'], ['A', 'C'],['C', 'F'], ['B', 'D'], ['B', 'R'], ['B', 'E']];
var AR_result = [];
var final_result=[];
dfs(final_path, AR_result, 'A', 'R');


//   console.log(result);
  //正确结果：[['A','B'],['B','R']]