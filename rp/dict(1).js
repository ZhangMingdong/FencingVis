var DictTree;
var Node;

var data = [["S","FF","0"],["S","BF","2"],["S","FF","0"],["S","FF","0"],["S","FF","2"],["S","FF","0"],["S","BF","1"],["S","FF","2"],["S","BB","BF","2"],["S","FF","0"],["S","BB","FB","BF","2"],["S","FF","1"],["S","FF","2"],["S","BF","2"],["S","BB","FB","1"],["S","FF","0"],["S","BB","FB","1"],["S","BB","FB","BF","2"],["S","FF","0"],["S","BB","FB","1"],["S","BB","FF","1"],["S","BB","FB","1"],["S","BB","0"],["S","BF","1"],["S","FB","2"],["S","BB","FB","BF","2"],["S","BF","1"],["S","FF","0"],["S","FF","1"],["S","FF","1"],["S","FF","0"],["S","FB","0"],["S","BB","FB","1"],["S","FB","2"],["S","BB","FB","1"],["S","BF","0"],["S","BF","1"],["S","BF","1"]];


var Node = (function(chara, deep, data) {
    function Node(chara, deep, data) {
        this.chara = chara;
        this.data = [];
        this.deep = deep;
        this.dataCnt = 0;
        this.sons = [];
    }
    return Node;
})();

var DictTree = (function(alphabet, startChara) {
    function DictTree(alphabet, startChara) {
        this.character = alphabet;
        this.wordList = [];
        this.root = new Node(startChara, 0, -1)
    }

    DictTree.prototype.addData = function(word) {
        this.wordList.push(word);
        var nowNode = this.root;
        for(var deep = 1; deep < word.status.length; deep++)
        {
            var flag = true;
            for(var k = 0; k < nowNode.sons.length; k++)
            {
                if(nowNode.sons[k].chara == word.status[deep])
                {
                    nowNode = nowNode.sons[k];
                    flag = false;
                    break;
                }
            }
            if (flag == true)
            {
                nowNode.sons.push(new Node(word.status[deep], deep, -1));
                nowNode = nowNode.sons[k];
            }
        }
        nowNode.data.push(word);
    }

    DictTree.prototype.getWords = function () {
        return this.wordList;
    }

    DictTree.prototype.getTree = function () {
        return this.root;
    }

    DictTree.prototype.dfs = function (nowword, nownode) {
        if(nownode.data.length > 0)
        {
            for(var i = 0; i < nownode.data.length; i++)
            {
                this.sortedWords.push(nownode.data[i]);
            }
            return;
        }
        for(var j = 0; j < this.character.length; j++)
        {
            for(var i = 0; i < nownode.sons.length; i++)
            {
                if(this.character[j] == nownode.sons[i].chara)
                {
                    var newword = nowword.concat();
                    newword.push(nownode.chara);
                    this.dfs(newword, nownode.sons[i]);
                    break;
                }
            }
        }
    }

    DictTree.prototype.getSortedWords = function () {
        this.sortedWords = [];
        this.dfs([], this.root);
        return this.sortedWords;
    }

    return DictTree;
})();

var dictTree = new DictTree(["FF", "BF", "FB", "BB", "0", "1", "2"], "S");

for (var i = 0; i < data.length; i++)
{
    dictTree.addData({status:data[i]});
}
console.log(dictTree.getTree());

console.log(dictTree.getWords());

console.log(dictTree.getSortedWords());

