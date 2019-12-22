# Surface-Code
作者：WHU 穆冠群

超导量子计算机是Google，IBM等公司的量子计算的物理方案。超导量子计算机是基于约瑟夫森结来实现量子信息的处理的，但约瑟夫森结有天生的缺陷，即单个量子比特只能连接相邻的量子比特，而无法实现全局连通性。

由此，surface code 便被设计出来以弥补超导计算机的缺陷，基于 surface code 量子纠错码的拓扑保护，即使量子比特信息的处理保真度不高，但在 surface code 上编码的量子信息仍具有很高的保真度。并且，通过在编码空间的创造出对应于不同量子比特的孔洞，利用surface code 可以实现超导量子比特的全局连通性。

本代码涉及到 surface code 运行的模拟，目前可以对任意尺寸、任意挖孔形状、任意挖孔数的 surface code 样本进行量子纠错。

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

