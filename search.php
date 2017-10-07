<?php 


function ispinyin($s){
        $allen = preg_match("/^[^/x80-/xff]+$/", $s);   //判断是否是英文
        $allcn = preg_match("/^[".chr(0xa1)."-".chr(0xff)."]+$/",$s);  //判断是否是中文
        if($allen){  
              return 'py';  
        }else{  
              if($allcn){  
                   return 'zw';  
              }else{  
                   return 'hh';  
              }  
        }  
                
   }


   $conn=mysql_connect('127.0.0.1','root','qihong');  
if(!$conn){  
  die('Could not connect: '.mysql_error());
  exit;  
}  


mysql_select_db("pinyin", $con);

mysql_query("SET NAMES UTF8");

// echo ischinese($_REQUEST["searchName"]).'aaaaaaa';


if ($_REQUEST["lang"] == "en") {
  
  $sql="select * from pinyin.pinyin  where py like '%".$_REQUEST['searchName']."%' group by py order by id desc limit 10";
} else {
 
 $sql="select * from pinyin.pinyin  where title like '%".$_REQUEST['searchName']."%'  group by title order by id desc limit 10";
}

// echo $sql;

// echo $sql;

$rs=mysql_query($sql,$conn);



while($row=mysql_fetch_object($rs)) {


   $row->id = intval($row->id, 10);
  $arr[] = $row;
} 



// echo $sql;

$obj->data = json_encode($arr);
echo json_encode($arr)."\n\n";



   ?>