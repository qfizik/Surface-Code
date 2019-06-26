# Surface-Code


本代码涉及到surface code的运行，目前可以对任意尺寸，任意量子比特数的surface code 进行量子纠错，但只可以显示单个量子比特的纠错成功与否。

操作者若想进行surface code 的运行，可以在本段代码的尾端用如下两种代码进行操作：

'''

Run.run_loop([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
Run.run_strip([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)

'''

其中， run_loop 或者 run_strip 为判断单个量子比特的纠错成功与否的检测模式

run_loop 函数中第一位变量为运行的单个编码空间中的量子比特的翻转概率的集合，第二个变量为 surface code 的尺寸，第三个变量为运行的次数，第四个变量为surface code 尺寸与挖孔的增长模式，此函数可以在代码中自行设置。

此外，此程序还可以用于探测 surface code 的 threshold
