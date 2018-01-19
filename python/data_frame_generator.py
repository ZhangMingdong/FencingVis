# -*- coding: utf-8 -*-
"""
Created on Fri Jan 19 14:52:22 2018
用来生成视频的时间表
@author: Administrator
"""

file = open("data_frame.csv","w");

for i in range(0,30):
    for j in range(0,60):
        for k in range(0,30):
            print(i,":",j,":",k,file=file);
            
file.close();