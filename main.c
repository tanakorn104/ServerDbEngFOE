// Online C compiler to run C program online
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// Online C compiler to run C program online
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
int checkerror(char *mainstr){
   if(!((*mainstr>=48)&&(*mainstr<58))){
       printf("ERROR\n");
       return 0;
   }
    while(*mainstr !='\0'){
        if(!(*mainstr==43||*mainstr==45||((*mainstr>=48)&&(*mainstr<58)))){
            printf("ERROR\n");
            return 0;
        }
        mainstr++;
    }
    if( *mainstr--==43||*mainstr--==45){
        printf("ERROR\n");
        return 0;
    }
    return 1;
}
int cal(char *equ,int* result){
    char temp[64];
    int sign = 1;
    strcpy(temp,equ);
    char *token = strtok(equ,"+-");

    while(token!=NULL){
        (*result) = *result+(atoi(token)*sign);
        (*(temp+strlen(token))=='-')?sign=-1:0;
    token = strtok(NULL,"+-");
    
    }
    return 1;
  
}
int main() {
    char equ[64];
    char temp[64];
    int result = 0;
    int* ptrresult = &result;
    printf("Enter Equation :");
    scanf("%63[^\n]s",equ);
    strcpy(temp,equ);
    while(strcmp(equ,"EXIT")){
        (checkerror(equ))&&cal(equ,ptrresult)&&printf("%s = %d\n",temp,result);
        printf("Enter Equation :");
        scanf(" %63[^\n]s",equ);
        strcpy(temp,equ);
    }
    printf("Bye!");

    return 0;
}





















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





#include <stdio.h>
#include <string.h>

int main() {
    char justuglystr[1024];
    printf("Enter ugly sentence what u want and this shit will make some happy to fucking smile:) :");
    scanf("%[^\n]s",justuglystr);
    
    char* justsomepointerTocatchHappy = strstr(justuglystr,"happy");
    char* cursorForwhatyouwant = justuglystr;
    while(*cursorForwhatyouwant!='\0'){
        if(cursorForwhatyouwant == justsomepointerTocatchHappy){
            printf("happy :)");
            cursorForwhatyouwant+=5;
            justsomepointerTocatchHappy = strstr(cursorForwhatyouwant,"happy");
        }else{
            printf("%c",*cursorForwhatyouwant);
            cursorForwhatyouwant++;
        }
        
    }
    
    return 0;