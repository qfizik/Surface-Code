# Surface-Code

### Contributor：Guanqun Mu(穆冠群) ,Wuhan University, Hubei, P.R. China
### Introduction

A superconducting quantum computer is a physical solution for quantum computing by companies such as Google and IBM. The surface code is designed to compensate for the low fidelity of superconducting computers. Based on the surface code, the topological protection of quantum error correction codes, even if the processing fidelity of the qubit information is not high, the surface code Quantum information still has high fidelity. Moreover, by creating holes corresponding to different qubits in the coding space, ones can achieve scalable quantum computing.

This code relates to the simulation of surface code operation. At present, quantum error correction can be performed on surface code samples of any size, arbitrary hole shape, and arbitrary number of holes.

超导量子计算机是Google，IBM等公司的量子计算的物理方案。surface code 是被设计出来以弥补超导计算机的保真度低的缺陷的，基于 surface code 量子纠错码的拓扑保护，即使量子比特信息的处理保真度不高，但在 surface code 上编码的量子信息仍具有很高的保真度。并且，通过在编码空间的创造出对应于不同量子比特的孔洞，可以实现可扩展的量子计算。

本代码涉及到 surface code 运行的模拟，目前可以对任意尺寸、任意挖孔形状、任意挖孔数的 surface code 样本进行量子纠错。

### Usage
#### 1.If you want to run the surface code, he can use one of the following two attached at the end of the surface_code.js：

```javascript
Run.run_loop([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
Run.run_strip([0.65,0.7],[6,7],10,Main.Classic.Limy_Init_111)
```

run_loop or run_strip are two detection modes to determine the success of a single qubit error correction. The operation of run_loop corresponding to the detection of the digging qubits around the error occurs after error correction. run_strip corresponds to detecting whether the operator operation connecting the edge of the hole to the edge of the sample is correct after error correction.


The first variable in the run_loop function is the set of flipping probabilities of the qubits in the single coding space of the run. The second variable is the size of the surface code, the third variable is the number of runs, and the fourth variable is the surface code size. With the growth pattern of digging holes, this function can be set in the code. The output of these two functions is the number of errors in the error correction result within the set number of runs. This important information can be used to study the threshold of the surface code.

其中， run_loop 或者 run_strip 为判断单个量子比特的纠错成功与否的两种检测模式。 run_loop 对应于检测环绕挖孔量子比特的算符操作在纠错后时候出错。run_strip 对应于检测连接挖孔边界与样本边缘的算符操作在纠错后是否出错。


run_loop 函数中第一位变量为运行的单个编码空间中的量子比特的翻转概率的集合，第二个变量为 surface code 的尺寸，第三个变量为运行的次数，第四个变量为surface code 尺寸与挖孔的增长模式，此函数可以在代码中自行设置。此两种函数的输出结果为在设置的运行次数内纠错结果错误的个数。这个重要信息可以用于研究 surface code 的 threshold。

#### 2.You can display the generated surface code array with the following code:
```javascript
console.log(Main.AA)
```

#### 3.You can display the error qubit checked by check opreater with the following code:
```javascript
console.log(liu.real_D)
```

#### 4.You can display the recovery path of quantum error correction with the following code:
```javascript
console.log(Main.traced_list)
```

