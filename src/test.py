num_pl = int(input())
pl_list = input()
gift_list = []
mius_list = []
i = 0
times = 0
while True:
    if(not(pl_list[i]==' ')):
        
        times += 1
    
    
        if (times > num_pl):
            pl_list += pl_list[times-num_pl-1]
        if (i == 0 and times <= num_pl):
            gift_list.append(1)
        else:
            if(pl_list[i] > pl_list[i-1]):
                gift_list.append(gift_list[i-1]+1)
                mius_list.append(1)
            elif(pl_list[i] == pl_list[i-1]):
                gift_list.append(gift_list[i-1])
                mius_list.append(0)
            elif(pl_list[i] < pl_list[i-1]):
                if (gift_list[i-1] > 1):
                    gift_list.append(1)
                    mius_list.append(gift_list[i]-gift_list[i-1])
                else:
                    gift_list.append(1)
                    gift_list[i-1] = 2
                    for j in range(len(mius_list)):
                        if(mius_list[-1-j] < 2):
                            b = mius_list.index(mius_list[-1-j])
                            gift_list[b] += 1
                        else:
                            break
                    mius_list.append(1)
        if(times > num_pl and (gift_list[i] == gift_list[times-num_pl-1])):
            break
    i+=1
print(pl_list) 
print(gift_list) 


print(sum(gift_list[-1*num_pl::]))

# num=input()
# time_list=input.split('')
# merge=[]
# k={}

# cross_area=[]
# for i in range(int(num)):
#     if(i==0):
#         merged.append((int(time_list[0]),int(time_list[1]))
#     else:
#         merged.append((int(time_list[i*2]),int(time_list[i*2+1])))
# merged.sort(key=lamda x:x[0])

# for i,area in enumerate(merged):
#     index=i+1
#     while (index<len(merged)):
#         if(area[0]<=merged[index][0]<area[0]):
#             left=max(area[0,merged[index][1]])
#             right=min(area[1],merged[index][1])
#             if(str(left)+' '+str(right) in k.keys()):
#                 k[str(left)+' '+str(right)]+=1
#             else:
#                 k[str(left)+' '+str(right)]=2
#             index+=1
#         else:
#             break
# max_k=max(k,items(),key=lamda x:x[1])[1]
# ans=[m for m,v in k.items() if v == max_k]

# if(len(ans)==1):
#     print(ans[0])
# else:
#     return_ans=[]
#     for num in ans:
#         return_ans.append([int(num.spit(' ')[0]),int(num.split(' ')[1])])
#     return_ans.sort(key=lambda x: x[0])
#     for i in range(len(return_ans)):
#         temp=i+1
#         next=i+1
#         while(temp<len(return_ans)):
#             if(return_ans[i][1]>=return_ans[temp][0]):
#                 return_ans[i][1]=return_ans[temp][1]
#                 temp+=1
#                 next=temp
#             else:
#                 break
#         i=next
#     f_ans=max(return_ans,key=lambda x: x[1]-x[0])
#     print(str(f_ans[0])+' '+str(f_ans[1]))
