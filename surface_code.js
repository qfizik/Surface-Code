//作者：穆冠群 WHU
var blossom = require('edmonds-blossom');

//_____________________________________________________________________________________________________________________________________
//__________________________________________________________Main模块___________________________________________________________________
//_____________________________________________________________________________________________________________________________________

//Main模块包含如下过程：
    // 一 . 指定尺寸的量子比特 lattice 样本的生成
    // 二 . 对基础样本中的全部量子比特的翻转 ，对指定量子比特的挖孔
    // 三 . Main 模块内置的 Classic 模块，针对操作者的特定需求提供样本预先设置的初始信息
    // 四 . Stablizer Opreator 对样本的作用，以及真实缺陷点的检测
    // 五 . 对样本的 X 或者 Z 类型边界的鬼出错点的添加
    // 六 . 对于应用过 Min_Weight 算法的结果进行字典包装，记录两个点的坐标信息、两点之间的min_weight，以及之间的具体连接路径
    // 七 . 将字典化后的信息翻译至可应用 Edmonds_Blossom 算法的语言
    // 八 . 将被 Edmonds_Blossom 算法处理过的信息重新包装，生成记录了所有缺陷点之间匹配信息的数组
    // 九 . Main 模块内置的 Trace 模块，用于追踪最终匹配结果的遍历路径，以便于Main.Result 模块进行检测
    // 十 . Main 模块内置的 Result 模块，对于不同类型的算符操作路径基矢进行纠错成功与否的判断
    // 十一 . Surface_Code 的初始信息的设置，操作步骤的整合（包括总缺陷点个数为奇数时，对鬼缺陷点进行逐个孤立）


var Main=new Object()

//样本生成模块
    //按要求产生未挖孔的比特平面
Main.gener_2d = function(label){
    
    // Main.Lx 与 Main.Ly均已对象化
    
    var label_A=label[0];
    var label_B=label[1];
    if (label_A==1){
        if (label_B=='X'){var label_C='Z'}
        else{var label_C='X'}
        
        var LE_colu=Array();
        for (var num_y=0;num_y<Main.Ly;num_y++){
            
            var LE_line=Array();
            for (var num_x=0;num_x<Main.Lx;num_x++){
                
                if (num_y%2==0){
                    if (num_x%2==0){LE_line.push(label_A)}
                    else {LE_line.push(label_B)}
                }
                else{
                    if (num_x%2==0){LE_line.push(label_C)}
                    else {LE_line.push(label_A)}
                }
            }
            LE_colu.push(LE_line)
        }
 
    }
    if(label_B==1){
        if (label_A=='X'){var label_C='Z'}
        else{var label_C='X'}

        var LE_colu=Array();
        for (var num_y=0;num_y<Main.Ly;num_y++){
            
            var LE_line=Array();
            for (var num_x=0;num_x<Main.Lx;num_x++){
                
                if (num_y%2==0){
                    if (num_x%2==0){LE_line.push(label_A)}
                    else {LE_line.push(label_B)}
                }
                else{
                    if (num_x%2==0){LE_line.push(label_B)}
                    else {LE_line.push(label_C)}
                }
            }
            LE_colu.push(LE_line)
        }
    }
    Main.AA=LE_colu
    
}

    //挖孔+翻转
Main.dig_and_flip_2d=function (p,dig_list){
    for (var num_y=0;num_y<Main.AA.length;num_y++){
        for (var num_x=0;num_x<Main.AA[0].length;num_x++){
            
            
            var opreating_one=Main.AA[num_y][num_x]
            //对于遍历处的元素验证是否为挖孔的元素
            var check_index=0
            for (var check_num=0;check_num<dig_list.length;check_num++){
                
                if (dig_list[check_num][0]==num_y && dig_list[check_num][1]==num_x){
                    check_index=1
                }
            }
            
            if (check_index==1){
                if (opreating_one==1){Main.AA[num_y][num_x]=0}
                else if (opreating_one=='X'){Main.AA[num_y][num_x]='XL'}
                if (opreating_one=='Z'){Main.AA[num_y][num_x]='ZL'}
            }
            else {
                if (opreating_one==1){
                    var xerror=0;var zerror=0;
                    if (Math.random()<=p){xerror=1}
                    else{}
                    if (Math.random()<=p){zerror=1}
                    else{}
                    
                    if (xerror==1&&zerror==0){Main.AA[num_y][num_x]=2}
                    else if (xerror==0&&zerror==1){Main.AA[num_y][num_x]=3}
                    else if (xerror==1&&zerror==1){Main.AA[num_y][num_x]=4}
                }
            }
        }
    }
}

//标注：X_Error：2, 4
//标注：Z_Error: 3, 4



//check模块

Main.check_XorZ=function (xorz){
    
    var defect_list_Z=Array()
    var defect_list_X=Array()
    
    for (var num_y=0;num_y<Main.AA.length;num_y++){
        for (var num_x=0;num_x<Main.AA[0].length;num_x++){
            var opreating_one=Main.AA[num_y][num_x]
            
            if (opreating_one=='Z'){

                var check_para_Z=0
                for (var num_yc=0;num_yc<Main.AA.length;num_yc++){
                    for (var num_xc=0;num_xc<Main.AA[0].length;num_xc++){
                        var qubit=Main.AA[num_yc][num_xc]
                        
                        if ((((num_xc-1==num_x)||(num_xc+1==num_x))&&num_yc==num_y)||(((num_yc-1==num_y)||(num_yc+1==num_y))&&num_xc==num_x)){
                            
                            if (qubit==3||qubit==4){check_para_Z+=1}
                        }
                    }
                }
                if (check_para_Z%2==1){defect_list_Z.push([num_y,num_x])}
            }
            
            if (opreating_one=='X'){
                
                var check_para_X=0
                for (var num_yc=0;num_yc<Main.AA.length;num_yc++){
                    for (var num_xc=0;num_xc<Main.AA[0].length;num_xc++){
                        var qubit=Main.AA[num_yc][num_xc]
                        
                        if ((((num_xc-1==num_x)||(num_xc+1==num_x))&&num_yc==num_y)||(((num_yc-1==num_y)||(num_yc+1==num_y))&&num_xc==num_x)){
                            if (qubit==2||qubit==4){check_para_X+=1}
                        }
                    }
                }
                if (check_para_X%2==1){defect_list_X.push([num_y,num_x])}
            }
        }
    }
    
    if (xorz=='X'){return defect_list_X}
    if (xorz=='Z'){return defect_list_Z}
}



//添加伪缺陷点模块
Main.add_boundary=function (xorz){
    
    var X_list=Array();
    var Z_list=Array();
    
    for (var num_y=0;num_y<Main.AA.length;num_y++){
        for (var num_x=0;num_x<Main.AA[0].length;num_x++){
            
            var one=Main.AA[num_y][num_x]
            if (one==1||one==2||one==3||one==4){
                
                if (Main.AA[num_y-1]==undefined){var up=Main.AA[num_y-1]}
                else{var up=Main.AA[num_y-1][num_x]}
                if (Main.AA[num_y+1]==undefined){var down=Main.AA[num_y+1]}
                else{var down=Main.AA[num_y+1][num_x]}

                var left=Main.AA[num_y][num_x-1];
                var right=Main.AA[num_y][num_x+1];
                
                if((up==undefined||up=='XL'||up=='ZL')&&(down==undefined||down=='XL'||down=='ZL')&&(left==undefined||left=='XL'||left=='ZL')&&(right==undefined||right=='XL'||right=='ZL')){}
                else{
                    if (up=='ZL'||up=='XL'||up==undefined){
                        if (left=='X'||left=='XL'||right=='X'||right=='XL'||down=='ZL'||down=='Z'){Z_list.push([num_y-1,num_x])}
                        else if (left=='Z'||left=='ZL'||right=='Z'||right=='ZL'||down=='XL'||down=='X'){X_list.push([num_y-1,num_x])}
                        else{}
                    }
                    else{}
                    
                    if (down=='ZL'||down=='XL'||down==undefined){
                        if (left=='X'||left=='XL'||right=='X'||right=='XL'||up=='ZL'||up=='Z'){Z_list.push([num_y+1,num_x])}
                        else if (left=='Z'||left=='ZL'||right=='Z'||right=='ZL'||up=='XL'||up=='X'){X_list.push([num_y+1,num_x])}
                        else{}
                    }
                    else{}
                    
                    if (left=='ZL'||left=='XL'||left==undefined){
                        if (up=='X'||up=='XL'||down=='X'||down=='XL'||right=='ZL'||right=='Z'){Z_list.push([num_y,num_x-1])}
                        else if (up=='Z'||up=='ZL'||down=='Z'||down=='ZL'||right=='XL'||right=='X'){X_list.push([num_y,num_x-1])}
                        else{}
                    }
                    else{}
                    
                    if (right=='ZL'||right=='XL'||right==undefined){
                        if (up=='X'||up=='XL'||down=='X'||down=='XL'||left=='ZL'||left=='Z'){Z_list.push([num_y,num_x+1])}
                        else if (up=='Z'||up=='ZL'||down=='Z'||down=='ZL'||left=='XL'||left=='X'){X_list.push([num_y,num_x+1])}
                        else{}
                    }
                    else{}
  
                }
            }
        }
    }
    
    if (xorz=='X'){return X_list}
    else if (xorz=='Z'){return Z_list}

}
//_________________________________________________________Main 模块暂停______________________________________________________________


//____________________________________________________________________________________________________________________________________
//____________________________________________________________liu模块_________________________________________________________________
//____________________________________________________________________________________________________________________________________

//liu模块包含如下过程：
    // 一 . 对于挖孔过后的样本，生成所有B类型边缘点
    // 二 . 对于任意一个选定的点，生成所有其可能的“任意连接点”（潜在的任意连接点包括真实缺陷点，鬼缺陷点，B类型边缘点，以及其自身）
    // 三 . 对于所有的参与匹配活动的点，生成其“任意连接点”路径总集合样本（鬼缺陷点只可以被动接受其他点的匹配，而不能主动匹配）
    // 四 . 对于真实缺陷点的总集合，生成他们连接所有点的 weight ，以及连接路径
    // 五 . 将 min_weight 算法处理过的信息翻译成大型数组，以便于 Main 模块进行字典包装


//B类型点的检测与组合模块

var liu=new Object()


//给定挖孔后的样本，生成所有B边缘点模块
liu.mark_B = function (AA,XorZ){
    
    var leny=AA.length;
    var lenx=AA[0].length;
    
    var B_X_list=Array()
    var B_Z_list=Array()
    
    for (var numy=0;numy<leny;numy++){
        for (var numx=0;numx<lenx;numx++){
            if(AA[numy][numx]==0){
                
                for (var add_onex=-2;add_onex<=2;add_onex+=2){
                    for (var add_oney=-1;add_oney<=1;add_oney+=2){
                        
                        var x_t=numx+add_onex
                        var y_t=numy+add_oney
                        
                        if(AA[y_t][x_t+1]==0&&AA[y_t][x_t-1]==0&&AA[y_t+1][x_t]==0&&AA[y_t-1][x_t]==0){}
                        else{
                            if (AA[y_t][x_t]=="X"||AA[y_t][x_t]=="XL"){
                                B_X_list.push([y_t,x_t])
                            }
                            else if (AA[y_t][x_t]=="Z"||AA[y_t][x_t]=="ZL"){
                                B_Z_list.push([y_t,x_t])
                            }
                        }
                    }
                }
                
                for (var add_onex=-1;add_onex<=1;add_onex+=2){
                    for (var add_oney=-2;add_oney<=2;add_oney+=2){
                        
                        var x_t=numx+add_onex
                        var y_t=numy+add_oney
                        
                        if(AA[y_t][x_t+1]==0&&AA[y_t][x_t-1]==0&&AA[y_t+1][x_t]==0&&AA[y_t-1][x_t]==0){}
                        else{
                            if (AA[y_t][x_t]=="X"||AA[y_t][x_t]=="XL"){
                                B_X_list.push([y_t,x_t])
                            }
                            else if (AA[y_t][x_t]=="Z"||AA[y_t][x_t]=="ZL"){
                                B_Z_list.push([y_t,x_t])
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (XorZ=="X"){
        for (e=0;e<B_X_list.length;e++){
            t=B_X_list[e]
            AA[t[0]][t[1]]="B"
        }
    }
    
    else if (XorZ=="Z"){
        for (e=0;e<B_Z_list.length;e++){
            t=B_Z_list[e]
            AA[t[0]][t[1]]="B"
        }
    }
    
    liu.ABED=AA
    liu.B_list=Array()
    
    for (e1=0;e1<AA.length;e1++){
        for (e2=0;e2<AA[0].length;e2++){
            if(AA[e1][e2]=="B"){
                liu.B_list.push([e1,e2])
            }
        }
    }
    
    //输出总样本为liu.ABED
    //输出B类型点的数组为liu.B_list
}

liu.mark_DandB = function(){
    
    
    for (var num_e=0;num_e<liu.all_D.length;num_e++){
        var D_e =liu.all_D[num_e]
        if(D_e[0]<Main.Ly&&D_e[0]>=0&&D_e[1]<Main.Lx&&D_e[1]>=0){
            Main.AA[D_e[0]][D_e[1]]="D"
        }
        
    }
    
    for (var num_b=0;num_b<liu.B_list.length;num_b++){
        var B_e =liu.B_list[num_b]
        Main.AA[B_e[0]][B_e[1]]="B"
    }
}

//求出“随意连接点”基矢的操作函数
    //定义是否在其中的函数

    //更新
liu.INorNOT = function(a,A){
    var ay=a[0]
    var ax=a[1]
    if (ay==-1||ay==Main.Ly){
        if (ax==-1||ax==Main.Lx){var anst=0}
        else{var anst=1}
    }
    else{
        if (ax==-1||ax==Main.Lx){var anst=1}
        else{
            if(Main.AA[ay][ax]=="D"){var anst=1}
            else{var anst=0}
        }
    }
    return anst
}


    //定义基函数：给定AA，指定点A，指定点B，求出A点的所有“随意连接点”（函数型输出）
liu.couple_boudaried_digged_list = function(AA,dotA,dotB=[]){
    
    var y_start=dotA[0]
    var x_start=dotA[1]

    
    var x_left_stop=0
    var x_right_stop=AA[0].length
    
    var picked_line=Array()
    
    
    // 检测链向左延伸，直到触及B类点，标记向左最大长度
    var stop_para=0
    
    for(var x_left=0;x_start-x_left>=-1&&stop_para==0;x_left+=2){
        
        if(liu.INorNOT([y_start,x_start-x_left],dotB)==1){picked_line.push([y_start,x_start-x_left])}
        
        
        if (x_start-x_left==-1){x_left_stop=x_left}
        
        else if (AA[y_start][x_start-x_left]=="B"&&AA[y_start][x_start-x_left-1]!=0&&AA[y_start][x_start-x_left-2]=="B"){
            stop_para=1
            x_left_stop=x_left-2
            
            if (x_left_stop==-2){x_left_stop=0;picked_line.push([y_start,x_start-2])}
            else{picked_line.push([y_start,x_start-x_left])}
            
        }
        else if (AA[y_start][x_start-x_left]=="B"&&AA[y_start][x_start-x_left-1]==0){
            stop_para=1
            x_left_stop=x_left-2
            
            if (x_left_stop==-2){x_left_stop=0}
            else{picked_line.push([y_start,x_start-x_left])}
        }
        else{x_left_stop=x_left}

    }
    
    // 检测链向右延伸，直到触及B类点，标记向右最大长度
    var stop_para=0
    for(var x_right=0;x_start+x_right<=AA[0].length&&stop_para==0;x_right+=2){
        
        if(liu.INorNOT([y_start,x_start+x_right],dotB)==1){picked_line.push([y_start,x_start+x_right])}
        
        if (x_start+x_right==AA[0].length){x_right_stop=x_right}
        
        else if (AA[y_start][x_start+x_right]=="B"&&AA[y_start][x_start+x_right+1]!=0&&AA[y_start][x_start+x_right+2]=="B"){
            stop_para=1
            x_right_stop=x_right-2
            
            if (x_right_stop==-2){x_right_stop=0;picked_line.push([y_start,x_start+2])}
            else{picked_line.push([y_start,x_start+x_right])}
        
        }
        else if (AA[y_start][x_start+x_right]=="B"&&AA[y_start][x_start+x_right+1]==0){
            stop_para=1
            x_right_stop=x_right-2
            
            if (x_right_stop==-2){x_right_stop=0}
            else{picked_line.push([y_start,x_start+x_right])}
        
        }
        else{x_right_stop=x_right}
    
    }
    
    var x_left_stop_bfen=x_left_stop
    var x_right_stop_bfen=x_right_stop
    
    //检测链向上平移
    
    var stop_para_y=0

    for (var y_up=2;y_start-y_up>=-1&&stop_para_y==0;y_up+=2){
        
        
      //  if(liu.INorNOT([y_start-y_up,x_start],dotB)==1){picked_line.push([y_start-y_up,x_start])}
        
        //触底
        if (y_start-y_up==-1){
            
            if(liu.INorNOT([y_start-y_up,x_start],dotB)==1){picked_line.push([y_start-y_up,x_start])}
            for(var x_left=2;x_left<=x_left_stop;x_left+=2){
                if(liu.INorNOT([y_start-y_up,x_start-x_left],dotB)==1){picked_line.push([y_start-y_up,x_start-x_left])}
            }
            for(var x_right=2;x_right<=x_right_stop;x_right+=2){
                if(liu.INorNOT([y_start-y_up,x_start+x_right],dotB)==1){picked_line.push([y_start-y_up,x_start+x_right])}
            }
        }
        //搜索到了0类型路径
        else if (AA[y_start-y_up+1][x_start]==0){stop_para_y=1}
        //触及到了边缘
        else if (AA[y_start-y_up+1][x_start]!=0 && AA[y_start-y_up][x_start]=="B"){
            stop_para_y=1;picked_line.push([y_start-y_up,x_start]);
            if(liu.INorNOT([y_start-y_up,x_start],dotB)==1){picked_line.push([y_start-y_up,x_start])}
        }
        //？
        else if (AA[y_start-y_up][x_start]=="B"){
            stop_para_y=1;picked_line.push([y_start-y_up,x_start]);
            if(liu.INorNOT([y_start-y_up,x_start],dotB)==1){picked_line.push([y_start-y_up,x_start])}
        }
        
        //以上为平移中，原始点直接接触到了B类点导致平移终止的情况
        //以下为向左向右依次延伸的步骤
        
        
        else{

            if(liu.INorNOT([y_start-y_up,x_start],dotB)==1){picked_line.push([y_start-y_up,x_start])}
            

            var stop_para=0
            for(var x_left=2;x_left<=x_left_stop&&stop_para==0;x_left+=2){

                
                if(liu.INorNOT([y_start-y_up,x_start-x_left],dotB)==1){picked_line.push([y_start-y_up,x_start-x_left])}

                if (x_start-x_left==-1){}
                
                else if (AA[y_start-y_up][x_start-x_left]=="B"){
                    stop_para=1
                    x_left_stop=x_left-2
                    picked_line.push([y_start-y_up,x_start-x_left])
                }
            }
        
            var stop_para=0
            for(var x_right=2;x_right<=x_right_stop&&stop_para==0;x_right+=2){
                
                
                if(liu.INorNOT([y_start-y_up,x_start+x_right],dotB)==1){picked_line.push([y_start-y_up,x_start+x_right])}
        
                if (x_start+x_right==AA[0].length){}
                
                else if (AA[y_start-y_up][x_start+x_right]=="B"){
                    stop_para=1
                    x_right_stop=x_right-2
                    picked_line.push([y_start-y_up,x_start+x_right])
                }
            }
        }
    }
    
    var x_left_stop=x_left_stop_bfen
    var x_right_stop=x_right_stop_bfen
    
    
    //检测链向下平移
    
    var stop_para_y=0
    
    for (var y_down=2;y_start+y_down<=AA.length&&stop_para_y==0;y_down+=2){
        
   //     if(liu.INorNOT([y_start+y_down,x_start],dotB)==1){picked_line.push([y_start+y_down,x_start])}
        
        //触底
        if (y_start+y_down==AA.length){
            if (liu.INorNOT([y_start+y_down,x_start],dotB)==1){picked_line.push([y_start+y_down,x_start])}
            
            for(var x_left=2;x_left<=x_left_stop;x_left+=2){
                if(liu.INorNOT([y_start+y_down,x_start-x_left],dotB)==1){picked_line.push([y_start+y_down,x_start-x_left])}
            }
            for(var x_right=2;x_right<=x_right_stop;x_right+=2){
                if(liu.INorNOT([y_start+y_down,x_start+x_right],dotB)==1){picked_line.push([y_start+y_down,x_start+x_right])}
            }
        }
        //搜索到了0型qubit
        else if (AA[y_start+y_down-1][x_start]==0){stop_para_y=1}
        //搜索到了边缘
        else if (AA[y_start+y_down-1][x_start]!=0 && AA[y_start+y_down][x_start]=="B"){
            stop_para_y=1;picked_line.push([y_start+y_down,x_start]);
            if(liu.INorNOT([y_start+y_down,x_start],dotB)==1){picked_line.push([y_start+y_down,x_start])}
        }
        //？
        else if (AA[y_start+y_down][x_start]=="B"){
            stop_para_y=1;picked_line.push([y_start+y_down,x_start]);
            if(liu.INorNOT([y_start+y_down,x_start],dotB)==1){picked_line.push([y_start+y_down,x_start])}
        }
        
        //以上为平移中，原始点直接接触到了B类点导致平移终止的情况
        //以下为向左向右依次延伸的步骤
        else{
            
            if(liu.INorNOT([y_start+y_down,x_start],dotB)==1){picked_line.push([y_start+y_down,x_start])}
            
            var stop_para=0
            for(var x_left=2;x_left<=x_left_stop&&stop_para==0;x_left+=2){
                
                
                if(liu.INorNOT([y_start+y_down,x_start-x_left],dotB)==1){picked_line.push([y_start+y_down,x_start-x_left])}
        
                if (x_start-x_left==-1){}
        
                else if (AA[y_start+y_down][x_start-x_left]=="B"){
                    stop_para=1
                    x_left_stop=x_left-2
                    picked_line.push([y_start+y_down,x_start-x_left])
                }
            }
        
            var stop_para=0
            for(var x_right=2;x_right<=x_right_stop&&stop_para==0;x_right+=2){
                
                if(liu.INorNOT([y_start+y_down,x_start+x_right],dotB)==1){picked_line.push([y_start+y_down,x_start+x_right])}
        
                if (x_start+x_right==AA[0].length){}
                
                else if (AA[y_start+y_down][x_start+x_right]=="B"){
                    stop_para=1
                    x_right_stop=x_right-2
                    picked_line.push([y_start+y_down,x_start+x_right])
                }
            }
        }
    }
    picked_line.unshift(dotA)
    
    return picked_line
}

    //优化数据储存算法
liu.storage=function(){
    liu.storaged_list=Array()
    for (var numy=0;numy<=Main.Ly+1;numy++){
        liu.storaged_list.push(Array())
        for (var numx=0;numx<=Main.Lx+1;numx++){
            liu.storaged_list[numy].push(Array())
        }
    }
    
    for(num1=0;num1<liu.len_all;num1++){
        var opreating_thr=liu.big_unopreating_list[num1]
        liu.storaged_list[opreating_thr[0]+1][opreating_thr[1]+1].push(num1)
    }
    
}

/*
    //对于需要进行liu操作的匹配点，生成对应的任意匹配点基矢量（生成结果函数型）
liu.ready_to_liu=function(real_D,B_list,goast_D){
    
    console.log(real_D)
    console.log(B_list)
    console.log(goast_D)
    
    
    var D_all=real_D.concat(goast_D)
    var unopreating_list=real_D.concat(B_list)
    
    //liu.real_D是所有的真实出错点的集合
    liu.real_D=real_D
    //liu.B是所有的liu算法边界点的集合
    liu.B=B_list
    //liu.goast_D是所有的鬼出错点的集合
    liu.goast_D=goast_D
    //liu.big_unopreating_list是所有的要参与liu算法运算的单位的集合
    liu.big_unopreating_list=unopreating_list.concat(goast_D)
    
    //liu.all_D是所有的D类型点的总集合
    liu.all_D=real_D.concat(goast_D)
    
    //liu.len_all是总长度
    liu.len_all=liu.big_unopreating_list.length
    
    //在样本中标记B与D点
    liu.mark_DandB()
    //新建储存数组
    liu.storage()
    
    var Final_list=Array()
    
    for (var num=0;num<unopreating_list.length;num++){
        var unopreating_one=unopreating_list[num]
        var Final_list_e=liu.couple_boudaried_digged_list(liu.ABED,unopreating_one,D_all)
        Final_list_e.unshift(unopreating_one)
        Final_list.push(Final_list_e)
    }
    
    console.log(Final_list)
    
    return Final_list
}

*/
//更新

liu.ready_to_liu=function(real_D,B_list,goast_D){
    
//    console.log(real_D)
//    console.log(B_list)
//    console.log(goast_D)
    
    
    var D_all=real_D.concat(goast_D)
    var unopreating_list=real_D.concat(B_list)
    
    //liu.real_D是所有的真实出错点的集合
    liu.real_D=real_D
    //liu.B是所有的liu算法边界点的集合
    liu.B=B_list
    //liu.goast_D是所有的鬼出错点的集合
    liu.goast_D=goast_D
    //liu.big_unopreating_list是所有的要参与liu算法运算的单位的集合
    liu.big_unopreating_list=unopreating_list.concat(goast_D)
    
    //liu.all_D是所有的D类型点的总集合
    liu.all_D=real_D.concat(goast_D)
    
    //liu.len_all是总长度
    liu.len_all=liu.big_unopreating_list.length
    
    //在样本中标记B与D点
    liu.mark_DandB()
    //新建储存数组
    liu.storage()
    
    
    liu.AA=Array()
    
    liu.order_list=liu.big_unopreating_list
    
    for (var num=0;num<unopreating_list.length;num++){
        var unopreating_one=unopreating_list[num]
        
        var y_o=unopreating_one[0]
        var x_o=unopreating_one[1]
        
        var Final_list_e=liu.couple_boudaried_digged_list(liu.ABED,unopreating_one,D_all)

        var len_tt=Final_list_e.length
        
 //       console.log(Final_list_e)
        
  
        var order_t=Array()
        for (var num$=0;num$<liu.len_all;num$++){
            order_t.push("$")
        }
        liu.AA.push(order_t)
        

        //对$$$$$阵列的可连接点进行更改
        

        for (var num_in=0;num_in<len_tt;num_in++){
            var Tt=Final_list_e[num_in]
            var label_t=liu.storaged_list[Tt[0]+1][Tt[1]+1]
            
//            console.log(label_t)
            
            for(var num_lae=0;num_lae<label_t.length;num_lae++){
                
                var label_te=label_t[num_lae]
                liu.AA[num][label_te]=Math.abs(Tt[0]-y_o)+Math.abs(Tt[1]-x_o)
            }
            
            
        }
        

    }
    
    for (var num_g=0;num_g<liu.goast_D.length;num_g++){
        var order_t=Array()
        for (var num$=0;num$<liu.len_all;num$++){
            order_t.push("$")
        }
        liu.AA.push(order_t)
    }
    
 //   console.log(liu.order_list)
    
}



//最小路径算法及其前期翻译模块


//将原匹配点之间的大数组翻译成可应用liu算法的数组
liu.translate = function(AA){
    liu.order_list=Array();
    liu.translated_list=Array();
    
    var len=liu.goast_D.length
    for (var num=0;num<len;num++){
        AA.push([liu.goast_D[num]])
    }
    
    var len=AA.length
    for (var num=0;num<len;num++){
        liu.order_list.push(AA[num][0])
    }
    
    for (var num1=0;num1<len;num1++){
        
        var opreating_list=AA[num1]
        var opreating_e=opreating_list[0]
        var len2=liu.order_list.length
        
        var translated_list_e=Array();
        for(var num2=0;num2<len2;num2++){
            
            var opreating_one1=liu.order_list[num2]
            
            var para=0
            var len_op=opreating_list.length
            for (var num3=0;num3<len_op;num3++){
                var opreating_one2=opreating_list[num3]
                if (opreating_one1.toString()==opreating_one2.toString()){para=1}
            }
            
            if(para==0){
                translated_list_e.push("$")
            }
            else{
                var dis=Math.abs(opreating_one1[0]-opreating_e[0])+Math.abs(opreating_one1[1]-opreating_e[1])
                translated_list_e.push(dis)
            }
        }
        liu.translated_list.push(translated_list_e)
    }
    liu.AA=liu.translated_list
}


//liu算法开始运行模块
    //先定义一个返回最小值序号的函数
liu.min = function(){
    var min="$";
    liu.min_ans="$"
    var len = liu.dis_t.length;
    for(var num=0;num<len;num++){
        if (liu.dis_t[num]!="$"){
            if(min=="$"){
                min=liu.dis_t[num]
                liu.min_ans=num
            }
            else if (liu.dis_t[num]<min){
                min=liu.dis_t[num]
                liu.min_ans=num
            }
        }
    }
}

    //用确定路径的延伸来更新备选路径
liu.renew = function(){
    var t_line=liu.AA[liu.min_ans].slice()
    var t=liu.dis[liu.min_ans]
    
    var len=liu.dis.length;
    for (num=0;num<len;num++){
        if (t_line[num]=="$"){}
        else if (liu.dis[num]=="$"){
            liu.dis[num]=t+t_line[num]
            liu.dis_t[num]=t+t_line[num]
            
            liu.AA_f[num]=liu.AA_f[liu.min_ans].slice()
            liu.AA_f[num].push(num)
        }
        else if (t+t_line[num]<liu.dis[num]){
            liu.dis[num]=t+t_line[num]
            liu.dis_t[num]=t+t_line[num]
            
            liu.AA_f[num]=liu.AA_f[liu.min_ans].slice()
            liu.AA_f[num].push(num)
        }
    }
}

    //开始运行
liu.run = function(){
    
    
    //新建路径储存数组
    var len_to_liu=liu.real_D.length
    
    liu.dis_list = Array()
    liu.AA_f_list = Array()
    
    for (var numa=0;numa<len_to_liu;numa++){
        
        
        liu.AA_f = Array()
        for (var num=0;num<liu.AA.length;num++){
            liu.AA_f.push([])
        }
    
        for(var num=0;num<liu.AA[0].length;num++){
            if (liu.AA[numa][num]!="$"){
                liu.AA_f[num].push(num)
            }
        }
        
        
        //新建路径许可与可更替数组
        
        liu.dis=liu.AA[numa].slice()
        liu.dis_t=liu.AA[numa].slice()
        
        
    
        
        liu.min()
        while(liu.min_ans!="$"){
        
            liu.dis_t[liu.min_ans]="$"
            liu.renew()
            
            liu.min()
        } 
        liu.dis_list.push(liu.dis)
        liu.AA_f_list.push(liu.AA_f)
    }
}


//将匹配完成的数值解转化为坐标形式

liu.screen = function(){
    liu.len_real=liu.real_D.length
    liu.len_B=liu.B.length
    liu.len_goast=liu.goast_D.length
    liu.len_all=liu.big_unopreating_list.length
    
    liu.screen_list=Array()
    liu.screen_list_dis=Array()
    
    var len_AA_f=liu.AA_f_list.length
    for(var num_big=0;num_big<len_AA_f;num_big++){
        
        var picked_e=liu.AA_f_list[num_big]
        var selected_e=Array()
        
        var picked_e_dis=liu.dis_list[num_big]
        var selected_e_dis=Array()
        
        for (var num_all=0;num_all<liu.len_all;num_all++){
            if(num_all<liu.len_real||num_all>=liu.len_all-liu.len_goast){
                selected_e.push(picked_e[num_all].slice())
                selected_e_dis.push( picked_e_dis[num_all])
            }
        }
        
        liu.screen_list.push(selected_e.slice())
        liu.screen_list_dis.push(selected_e_dis.slice())
    }
}


//储存路径的数组：liu.screen_list
//储存距离的数组：liu.screen_list_dis
//点坐标与序号对应的数组：liu.order_list

//所有的即将字典化的元素的集合数组：liu.all_D

//所有的真实出错点的集合：liu.real_D
//所有的liu算法边界点的集合：liu.B
//所有的鬼出错点的集合：liu.goast_D


// real_D 的长度：liu.len_real
// B 的长度：liu.len_B
// goast_D 的长度：liu.len_goast

//real_D & B & goast_D的总长度：liu.len_all



//将被选择后的元素组合储存到字典中去

//注：储存的字典格式如下：   【defect_1:a;  defect_2:b;  label_1:[c,d];  label_2:[e,f];  free_energy:g;  path:[h,i,j,k,l]】
//注：孤立单个伪缺陷点的操作在此处进行！

Main.couple_diction= function (the_isolated_num=-1){
    var dicted_coupled=[]
    
    for (var num1=0;num1<liu.all_D.length;num1++){
        for (var num2=0;num2<liu.all_D.length;num2++){
            if(num2>num1){
                
                global['D'+parseInt(num1)+'_'+parseInt(num2)]={}
                var opone=eval('D'+parseInt(num1)+'_'+parseInt(num2))
                
                opone.defect1=num1
                opone.defect2=num2
                
                
                if (num1<liu.len_real && num2<liu.len_real){
                    opone.label_1=liu.order_list[num1]
                    opone.label_2=liu.order_list[num2]
                    opone.free_energy=liu.screen_list_dis[num1][num2]
                    opone.path=liu.screen_list[num1][num2]

                }
                
                
                else if (num1<liu.len_real && num2>=liu.len_real){
                    opone.label_1=liu.order_list[num1]
                    opone.label_2=liu.order_list[num2+liu.len_B]
                    
                    if(num2==the_isolated_num){
                        opone.free_energy=4*Main.Lx+4*Main.Ly
                        opone.path=[]
                    }
                    else{
                        opone.free_energy=liu.screen_list_dis[num1][num2]
                        opone.path=liu.screen_list[num1][num2]
                    }
                }
                
                else if (num1>=liu.len_real && num2>=liu.len_real){
                    opone.label_1=liu.order_list[num1]
                    opone.label_2=liu.order_list[num2]
                    
                    if(num1==the_isolated_num||num2==the_isolated_num){
                        opone.free_energy=4*Main.Lx+4*Main.Ly
                        opone.path=0
                    }
                    else{
                        opone.free_energy=0
                        opone.path=0
                    }
                }
                
                dicted_coupled.push('D'+parseInt(num1)+'_'+parseInt(num2))
            }
        }
    }
    return dicted_coupled
}

//liu类的操作面板
liu.opreat=function(real_D,goast_D){
    var AA=JSON.parse(JSON.stringify(Main.AA))
    Main.AA_bfen=JSON.parse(JSON.stringify(Main.AA))

    liu.mark_B(AA,Main.XorZ)

    var ans=liu.ready_to_liu(real_D, liu.B_list ,goast_D)

//    liu.translate(ans)

    liu.run()

    liu.screen()
//    console.log(liu.screen_list_dis)

    Main.AA=JSON.parse(JSON.stringify(Main.AA_bfen))
    //输出按照rD+gD的组合（内部path为rD+B+gD的组合）
}


//____________________________________________________________________________________________________________________________________
//_________________________________________________________liu模块结束________________________________________________________________
//____________________________________________________________________________________________________________________________________

//_________________________________________________________Main 模块重启______________________________________________________________


//应用Edmond匹配算法前的翻译工作【勿改】

    //翻译成包语言
Main.py_translate_to_java = function (DICT_PY){
    java_list=[]
    for (var num1=0;num1<DICT_PY.length;num1++){
        var e_1=eval(DICT_PY[num1])
        var java_list_one1=e_1.defect1
        var java_list_one2=e_1.defect2
        var java_list_one3=5*(Main.Lx+Main.Ly)-e_1.free_energy
        var java_list_one=[java_list_one1,java_list_one2,java_list_one3]
        java_list.push(java_list_one)}
    
    return java_list
    }

    //翻译成js语言
Main.java_translate_to_py=function (ANS_JAVA){
    
    picked_list=[]
    for (var num1=0;num1<ANS_JAVA.length;num1++){
        var num2=ANS_JAVA[num1]
        if (num1<num2){
            picked_list.push('D'+parseInt(num1)+'_'+parseInt(num2))
        }
    }
    return picked_list
}

//检测模块

    //将匹配结果以坐标的形式显示出（最终结果删除人为添加的错误点之间的匹配的干扰）
Main.decode_py=function(py_list){
    
    var decoded_list=Array()
    for (var numpy=0;numpy<py_list.length;numpy++){
        var opreat_one=eval(py_list[numpy])
        var num1 =opreat_one.defect1
        var num2 =opreat_one.defect2
        
        if (num1>=liu.len_real && num2>=liu.len_real){}
        else{
            decoded_list.push(py_list[numpy])
        }
    }
    Main.decoded_list=decoded_list
}

//插入 Main.Trace 模块
//_____________________________________________________________________________________________________________________________________
//______________________________________________________Main.Trace模块_________________________________________________________________
//_____________________________________________________________________________________________________________________________________
//注：Main.Trace 模块只在 Result 模块中的 loop 类型检查中有应用

//Main.Trace 模块包含如下过程：
    // 一 . 对于标定的有限路径节点的信息，生成所有的路径节点
    // 二 . 对于生成的所有路径节点，生成所有其经过的量子信息比特

Main.Trace=Object()

    //跟踪路径程序
Main.Trace.path = function(){
    var trace_all=Array()
    
    for (var num1=0;num1<Main.decoded_list.length;num1++){
        
        var trace=Array()
        var opreating=eval(Main.decoded_list[num1])
        trace.push(opreating.label_1)
        
        var path_list=opreating.path
        for(var num2=0;num2<path_list.length;num2++){
            var pathnum=path_list[num2]
            trace.push(liu.order_list[pathnum])
            
        }
        trace_all.push(trace)
    }
    
    return trace_all
}

    //跟踪路径函数元件
Main.Trace.downpath = function(dotA,dotB){
    
    var xa=dotA[0]
    var ya=dotA[1]
    var xb=dotB[0]
    var yb=dotB[1]
    
    var Tans=Array()
    
    while(xa!=xb||ya!=yb){
        if (xa<xb){
            xa+=2
        }
        else if (xa>xb){
            xa=xa-2
        }
        else {
            if (ya<yb){ya+=2}
            else if (ya>yb){ya=ya-2}
        }
        Tans.push([xa,ya].slice()) 
    }
    return Tans
}
        
    //跟踪路径
Main.Trace.run = function(pathed_list){
    
    var traced_list_all=Array()
    for (var num1=0;num1<pathed_list.length;num1++){
        var opreating_one =pathed_list[num1]
        
        var traced_list=Array()
        traced_list.push(opreating_one[0])
        for (var num2=0;num2<opreating_one.length-1;num2++){
            
            var op1=opreating_one[num2]
            var op2=opreating_one[num2+1]
            
            var anst=Main.Trace.downpath(op1,op2)
            traced_list=traced_list.concat(anst)
        }
        traced_list_all.push(traced_list)
    }
    return traced_list_all
}
    //将检查点之间的qubit坐标显示出
Main.Trace.change_to_0 = function(traced_list){
    
    var changed_list_all=Array()
    for(var num1=0;num1<traced_list.length;num1++){
        var opreating_one=traced_list[num1]
        
        var changed_list=Array()
        for (var num2=0;num2<opreating_one.length-1;num2++){
            var opreating_two1=opreating_one[num2]
            var opreating_two2=opreating_one[num2+1]
            
            var xt=(opreating_two1[0]+opreating_two2[0])/2
            var yt=(opreating_two1[1]+opreating_two2[1])/2
            
            changed_list.push([xt,yt])
        }
        changed_list_all.push(changed_list)
    }
    return changed_list_all
}

//Trace类的操作面板
Main.Trace.start = function(){
    var ANS0=Main.Trace.path()
    
    
    var ANS01=Main.Trace.run(ANS0)
    var ANS02=Main.Trace.change_to_0(ANS01)
    Main.traced_list=ANS02
}
//______________________________________________________________________________________________________________________________________
//______________________________________________________Main.Trace 模块结束_____________________________________________________________
//______________________________________________________________________________________________________________________________________

//插入 Main.Result 模块
//______________________________________________________________________________________________________________________________________
//______________________________________________________Main.Result 模块开始____________________________________________________________
//______________________________________________________________________________________________________________________________________

//Main.Result 模块包含如下类型样本的对于纠错成功与否的检测：
    // 一 . 单个量子比特的挖孔边界与样本边缘边界之间的算符操作路径的纠错成功与否的检测
    // 二 . 单个量子比特的围绕挖孔的loop型算符操作路径的纠错成功与否的检测

Main.Result=Object()

//单个量子比特
    //检测点边界与环边界之间的连接路径纠错成功与否

Main.Result.dot_and_loopboudary=function(XorZ){

    var num_strip=0
    
    if(XorZ=='X'){var XLorZL='XL'}
    if(XorZ=='Z'){var XLorZL='ZL'}
    
    //检查步骤1：匹配部分
    for (var num1=0;num1<Main.decoded_list.length;num1++){
        var opreating=Main.decoded_list[num1]
        var numy1=eval(opreating).label_2[0]
        var numx1=eval(opreating).label_2[1]
        
        if (numy1>=0&&numy1<Main.Ly){
            if (Main.AA[numy1][numx1]==XLorZL){
                num_strip+=1}
        }
        
        
        
        var numy2=eval(opreating).label_1[0]
        var numx2=eval(opreating).label_1[1]
        if (numy2>=0&&numy2<Main.Ly){
            if (Main.AA[numy2][numx2]==XLorZL){num_strip+=1}
        }
    }
    
    
    //检查步骤：样本部分
    for(numy=0;numy<Main.Ly;numy++){
        for(numx=0;numx<Main.Lx;numx++){
            
            var checking_one2=Main.AA[numy][numx];
            if (checking_one2==XLorZL){
                
                var lrud=[Main.AA[numy-1][numx],Main.AA[numy+1][numx],Main.AA[numy][numx-1],Main.AA[numy][numx+1]]
                for (var numlrud=0;numlrud<lrud.length;numlrud++){
                    
                    checking_one3=lrud[numlrud]
                    
                    if (XLorZL=='XL'){
                        if (checking_one3==2||checking_one3==4){num_strip+=1}
                    }
                    if (XLorZL=='ZL'){
                        if (checking_one3==3||checking_one3==4){num_strip+=1}
                    }
                }
            }
        }
    }
    
    
    if (num_strip%2==0){var ans=0}
    else{var ans=1}
    
    
    return ans
}

    //检查环状路径的纠错成功与否
Main.Result.loop=function(XorZ){
    
    var num_strip=0
    
    //求出此模型的 check_point_start坐标
    var break_para=0
    for (var check_point_Y=0;check_point_Y<Main.Ly && break_para==0;check_point_Y++){
        for (var check_point_X=0;check_point_X<Main.Lx && break_para==0;check_point_X++){
            
            var searching_one=Main.AA[check_point_Y][check_point_X]
            if (XorZ=="X" && searching_one=="ZL"){break_para=1;var check_point_start=[check_point_Y,check_point_X]}
            else if (XorZ=="Z" && searching_one=="XL"){break_para=1;;var check_point_start=[check_point_Y,check_point_X]}
        }
    }
    

    //匹配部分
    var ANST=Main.Trace.start()
    var check_point_Y=check_point_start[0]
    var check_point_X=check_point_start[1]
    
    for (var num1=0;num1<Main.traced_list.length;num1++){
        var checking_one=Main.traced_list[num1]
        
        
        for(var num2=0;num2<checking_one.length;num2++){
            var checking_two=checking_one[num2]
            
            if (checking_two[0]==check_point_Y && checking_two[1]<=Main.Lx && checking_two[1]>check_point_X){
                num_strip+=1
            }
        }
    }

    //样本部分
    if(XorZ=="X"){
        for (var numx=check_point_X;numx<Main.Lx;numx++){
            if(Main.AA[check_point_Y][numx]==2||Main.AA[check_point_Y][numx]==4){num_strip+=1}
        }
    }
    
    else if (XorZ=="Z"){
        for (var numx=check_point_X;numx<Main.Lx;numx++){
            if(Main.AA[check_point_Y][numx]==3||Main.AA[check_point_Y][numx]==4){num_strip+=1}
        }
    }

    
//    console.log(num_strip)
    
    
    if (num_strip%2==0){var ans=0}
    else{var ans=1}
    return ans
}

//______________________________________________________________________________________________________________________________________
//______________________________________________________Main.Result模块结束 ____________________________________________________________
//______________________________________________________________________________________________________________________________________


//样本生成时的工具箱

Main.Classic=Object()

    //指定挖孔边界的四个角的坐标，生成挖孔阵列
Main.Classic.four_dots =function(y0,y1,x0,x1){
    
    var d_list=Array()
    for (var numy=y0;numy<=y1;numy++){
        for (var numx=x0;numx<=x1;numx++){
            d_list.push([numy,numx])
        }
    }
    return d_list
}


//初始化
Main.Init= function(Lx,Ly,p,digged_list,star_begin){
    Main.Lx=Lx
    Main.Ly=Ly
    Main.p=p
    Main.digged_list=digged_list

    Main.star_begin=star_begin 
}

//________________________________________初始化设置________________________________________


//按距离与尺寸的关系比例增大（1:1）
Main.Classic.Morden_Init_1_1 =function(N,p,star_begin){
    
    var x0=2*N-1
    var y0=2*N-1
    var x1=4*N-3
    var y1=4*N-3
    
    Main.Lx=6*N-3
    Main.Ly=6*N-3
    
    Main.p=p
    
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin

}

//按距离与尺寸的关系比例增大（1:2）
Main.Classic.Morden_Init_1_2 =function(N,p,star_begin){
    
    var x0=4*N-1
    var y0=4*N-1
    var x1=6*N-3
    var y1=6*N-3
    
    Main.Lx=10*N-3
    Main.Ly=10*N-3
    
    Main.p=p
    
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin

}

//按比例增大(3:1:3)

Main.Classic.Limy_Init_313 =function(N,p,star_begin){
    
    var x0=6*N+1
    var y0=6*N+1
    var x1=6*N-1+2*N
    var y1=6*N-1+2*N
    
    
    Main.Lx=14*N+1
    Main.Ly=14*N+1
    
    Main.p=p
    
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin

    
}

    //按比例增大(1:1:1)
Main.Classic.Limy_Init_111 =function(N,p,star_begin){
    var x0=2*N+1
    var y0=2*N+1
    var x1=2*N-1+2*N
    var y1=2*N-1+2*N
    
    
    Main.Lx=6*N+1
    Main.Ly=6*N+1
    
    
    Main.p=p
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin
    
}


    //挖孔尺寸不变，样本尺寸增大
Main.Classic.Ordinary_Init2 =function(N,p,star_begin){
    var x0=2*N-1
    var x1=2*N+1
    var y0=2*N-1
    var y1=2*N+1
    
    Main.Lx=4*N+1
    Main.Ly=4*N+1
    Main.p=p
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin
   
}

    //挖孔尺寸不变，样本尺寸增大
Main.Classic.Ordinary_Init3 =function(N,p,star_begin){
    var x0=2*N-1
    var x1=2*N+3
    var y0=2*N-1
    var y1=2*N+3
    
    Main.Lx=4*N+3
    Main.Ly=4*N+3
    Main.p=p
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin
   
}


    //挖孔边界与样本边界之间的距离不变，样本尺寸增大(距离为2)
Main.Classic.Loop_Init2 = function(N,p,star_begin){
    var x0=5
    var x1=3+2*N
    var y0=5
    var y1=3+2*N
    
    Main.Lx=9+2*N
    Main.Ly=9+2*N
    Main.p=p
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin

}
    //挖孔边界与样本边界之间的距离不变，样本尺寸增大(距离为3)
Main.Classic.Loop_Init3 = function(N,p,star_begin){
    var x0=7
    var x1=5+2*N
    var y0=7
    var y1=5+2*N
    
    Main.Lx=13+2*N
    Main.Ly=13+2*N
    Main.p=p
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin

}

Main.Classic.Loop_Init_any = function(N,p,star_begin,N2){
    var x0=2*N2+1
    var x1=2*N+2*N2-1
    var y0=2*N2+1
    var y1=2*N+2*N2-1
    
    Main.Lx=2*N+4*N2+1
    Main.Ly=2*N+4*N2+1
    Main.p=p
    
    Main.digged_list=Main.Classic.four_dots(y0,y1,x0,x1)
    Main.star_begin=star_begin

}


var Run = new Object()

Run.run_strip=function(P,L,T,way){
    for (var Pnum=0;Pnum<P.length;Pnum++){
        Run.p=P[Pnum];
        for (var Lnum=0;Lnum<L.length;Lnum++){
            Run.N=L[Lnum]
            
            var T_all=0
            for (var t=0;t<T;t++){
                
                way(Run.N,Run.p,['Z',1])
                var t_t=Main.Start("X")

                T_all+=t_t
                
            }
            
            console.log(Run.p,Run.N,T_all)
            
        }
    } 
}

Run.run_loop=function(P,L,T,way){
    for (var Pnum=0;Pnum<P.length;Pnum++){
        Run.p=P[Pnum];
        for (var Lnum=0;Lnum<L.length;Lnum++){
            Run.N=L[Lnum]
            
            var T_all=0
            for (var t=0;t<T;t++){
                
                way(Run.N,Run.p,['Z',1])
                var t_t=Main.Start("Z")

                T_all+=t_t

               
/*              
                console.log(Main.AA)
                console.log(liu.storaged_list)
                
                console.log(liu.real_D)
                console.log(liu.goast_D)
                console.log(liu.B_list)
                
                console.log(Main.traced_list)
                console.log()
*/    
            }
            console.log(Run.p,Run.N,T_all)
            
        }
    } 
}

// Run.run_strip 为挖孔到边界的算符的纠错成功与否的检测
// Run.run_loop 为环绕挖孔比特的算符的纠错成功与否的检测

// 按比例增大 ： Main.Classic.Limy_Init 
// 挖孔尺寸为2，样本尺寸增大 : Main.Classic.Ordinary_Init2
//挖孔边界与样本边界之间的距离为2，样本尺寸增大 ：Main.Classic.Loop_Init2 
//挖孔边界与样本边界之间的距离为3，样本尺寸增大 ： Main.Classic.Loop_Init3


//运行
Main.Start= function(XorZ){
    
    Main.XorZ=XorZ
    
    Main.gener_2d(Main.star_begin)
    Main.dig_and_flip_2d(Main.p,Main.digged_list)
/*    
    Main.AA=
[ [ 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z' ],
  [ 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z' ],
  [ 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z' ],
  [ 3, 'X', 1, 'X', 1, 'XL', 0, 'XL', 0, 'XL', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 0, 'ZL', 0, 'ZL', 0, 'Z', 1, 'Z', 1, 'Z' ],
  [ 1, 'X', 1, 'X', 3, 'XL', 0, 'XL', 0, 'XL', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 0, 'ZL', 0, 'ZL', 0, 'Z', 1, 'Z', 1, 'Z' ],
  [ 1, 'X', 1, 'X', 1, 'XL', 0, 'XL', 0, 'XL', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z' ],
  [ 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z' ],
  [ 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1, 'X', 1 ],
  [ 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z', 1, 'Z' ] ]
  
  */
    var BBm=Main.check_XorZ(Main.XorZ)
    var BBn=Main.add_boundary(Main.XorZ)
    
    
    liu.opreat(BBm,BBn)
    
    
    if (liu.len_all%2==0){
        //输出按照rD+gD的组合（内部path为rD+B+gD的组合）
        var CC=Main.couple_diction()
        
/*        
        console.log(CC)
        
        for (var numC=0;numC<CC.length;numC++){
            console.log(eval(CC[numC]))
        }
*/        
        var JAVA=Main.py_translate_to_java(CC)
        
        var EE=Ee=blossom(JAVA)
        var PPYY=Main.java_translate_to_py(EE)
        
        
//        console.log(PPYY)
        
        
        Main.decode_py(PPYY)
        Main.Trace.start()
        
        if (XorZ=="Z"){var ANSF=Main.Result.loop(XorZ)}
        else if(XorZ=="X"){var ANSF=Main.Result.dot_and_loopboudary(XorZ)}
        
        
    }
    
    //对于奇数个缺陷点模型，采取逐个孤立鬼缺陷点的方法
    else{
        //注：
        // real_D 的长度：liu.len_real
        // goast_D 的长度：liu.len_goast
        
        var weight_min=(Main.Lx+Main.Ly)*2*liu.len_real
        for (var num_pause=liu.len_real;num_pause<liu.len_real+liu.len_goast;num_pause++){
            
            //输出按照rD+gD的组合（内部path为rD+B+gD的组合）
            
            var CC=Main.couple_diction(num_pause)
            var JAVA=Main.py_translate_to_java(CC)
            var EE=Ee=blossom(JAVA)
            
            var PPYY=Main.java_translate_to_py(EE)
            
            Main.decode_py(PPYY)
            
            var weight=0
            for(var num_wei=0;num_wei<Main.decoded_list.length;num_wei++){
                var t_wei=Main.decoded_list[num_wei]
                weight=eval(t_wei).free_energy+weight
            }
            
            if (weight<weight_min){
                weight_min=weight

                Main.Trace.start()

            if (XorZ=="Z"){var ANSF=Main.Result.loop(XorZ)}
            else if(XorZ=="X"){var ANSF=Main.Result.dot_and_loopboudary(XorZ)}
                
            }
        }
    }
    
    return ANSF
}


/*
for(var num_N2=4;num_N2<5;num_N2++){
    console.log("N2等于")
    console.log(num_N2)
    Run.run_loop([0.31,0.33,0.35,0.37],[3,4,5,6,7,8],10000,Main.Classic.Loop_Init_any,num_N2);
}
*/

//运行时间：L=3，1h ——> 2000
//time L**6


//Run.run_strip([0.04],[1,2,3,4,5,6,7,8],100,Main.Classic.Morden_Init_1_1)
