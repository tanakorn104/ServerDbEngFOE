// Online C compiler to run C program online
#include <stdio.h>
#include <string.h>
char getFirstLetterIfNotUgly(char *s){
    char justuglyword[20][6] = {
        "i","of","the","on","at","for","with","a","an","in",
        "I","OF","THE","ON","AT","FOR","WITH","A","AN","IN"
    };
    char *temp = s; 
    while(*temp!='\0'){
        if(*temp=='\n'){
            *temp='\0';
        }
        temp++;
    }
    for(int i =0 ;i<20;i++){
        if(!strcmp(s,justuglyword[i])){
            return ' ';
        }
            
    }
            return *s;
}


int main() {
    char str[100];
    fgets(str,99,stdin);
    int isletter=1,nletter=0,nword=0;
    char justoneuglyword[20];
    char *tempstr = str,*tempuglyword = justoneuglyword;
    
    while(*tempstr !='\0'){
        if(*tempstr !=' '&& *tempstr != '\n'){
            *tempuglyword = *tempstr;
            tempuglyword++;
            nletter++;
        }else{
            if(nletter){
                *tempuglyword = '\0';
                if(nword ==0 ){
                    printf("%c",(justoneuglyword[0])>96?justoneuglyword[0]-32:justoneuglyword[0]);
                    nword++;
                }else{
                    if(getFirstLetterIfNotUgly(justoneuglyword)!= ' '){
                        printf("%c",(justoneuglyword[0])>96?justoneuglyword[0]-32:justoneuglyword[0]);   
                    }
                }
                tempuglyword-=nletter;
                nletter = 0;
            }
        }
        tempstr++;
    }
    return 0;
}
















// Online C compiler to run C program online
#include <stdio.h>
#include <string.h>
#include <math.h>

void Hex2Dec(int *arrofHex,int *sum,int *count){

   for(int i =(*count)-1;i>=0;i--){
       (*sum) += (*arrofHex)*pow(16,i);
       arrofHex++;
   }
   return;
}

int isHexa(char *temp,int *justarrfordex,int *count){
     int inttemp;
    while(*temp !='\0'&&*temp!='\n'){
        if(*temp>96){
            *temp =*temp-32;
        }
        if(*temp>64&&*temp<71){
            inttemp = *temp-55;
        }else if(*temp>47&&*temp<58){
            inttemp = *temp-48;
        }else{
            
            return 0;
        }
        *justarrfordex = inttemp;
        (*count)++;
        justarrfordex++;
        temp++;
    }
    return 1;
    
}
int main() {
    int justarrfordex[100],sum=0,*ptrarr=justarrfordex,count=0;
    char str[100];
    fgets(str,99,stdin);
    if(isHexa(str,justarrfordex,&count)){
        Hex2Dec(justarrfordex,&sum,&count);
        printf("%d",sum);
    }
    
    return 0;
}