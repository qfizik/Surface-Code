# Surface-Code
作者：WHU 穆冠群

surface code 是拓扑量子计算的理论基础，基于 surface code 的拓扑保护，在 surface code 上编码的量子信息具有很高的保真度。故基于 surface code 开发的量子计算机有望成为未来物理上实现量子计算的候选者之一。  

本代码涉及到 surface code 运行的模拟，目前可以对任意尺寸、任意挖孔形状、任意挖孔数的 surface code 样本进行量子纠错，但目前只能显示单个量子比特的纠错成功或纠错失败的情况。

### 1.操作者若想进行surface code 的运行，可以在本段代码的尾端用如下两种代码进行操作：

```javascript
Run.run_loop([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
Run.run_strip([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
```

其中， run_loop 或者 run_strip 为判断单个量子比特的纠错成功与否的两种检测模式。 run_loop 对应于检测环绕挖孔量子比特的算符操作在纠错后时候出错。run_strip 对应于检测连接挖孔边界与样本边缘的算符操作在纠错后是否出错。


run_loop 函数中第一位变量为运行的单个编码空间中的量子比特的翻转概率的集合，第二个变量为 surface code 的尺寸，第三个变量为运行的次数，第四个变量为surface code 尺寸与挖孔的增长模式，此函数可以在代码中自行设置。此两种函数的输出结果为在设置的运行次数内纠错结果错误的个数。这个重要信息可以用于研究 surface code 的 threshold。

### 2.生成的surface code 样本可以用来如下代码来显示
```javascript
console.log(Main.AA)
```

### 3.check opreater显示出错的量子比特坐标可以用如下代码来显示：
```javascript
console.log(liu.real_D)
```

### 4.量子纠错的恢复路径可以用如下代码来显示：
```javascript
console.log(Main.traced_list)
```

