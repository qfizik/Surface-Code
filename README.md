# Surface-Code


本代码涉及到surface code的运行，目前可以对任意尺寸，任意量子比特数的surface code 进行量子纠错，但只可以显示单个量子比特的纠错成功与否。

### 1.操作者若想进行surface code 的运行，可以在本段代码的尾端用如下两种代码进行操作：

```javascript
Run.run_loop([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
Run.run_strip([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
```

其中， run_loop 或者 run_strip 为判断单个量子比特的纠错成功与否的检测模式

run_loop 函数中第一位变量为运行的单个编码空间中的量子比特的翻转概率的集合，第二个变量为 surface code 的尺寸，第三个变量为运行的次数，第四个变量为surface code 尺寸与挖孔的增长模式，此函数可以在代码中自行设置。

此两种函数的输出结果为在设置的运行次数内纠错结果错误的个数。这可以用于探测 surface code 的 threshold。

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

