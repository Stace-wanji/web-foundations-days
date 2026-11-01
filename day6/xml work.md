<?xml version="1.0" encoding="utf-8"?>

<LinearLayout

&#x20;   xmlns:android="http://schemas.android.com/apk/res/android"

&#x20;   android:layout\_width="match\_parent"

&#x20;   android:layout\_height="match\_parent"

&#x20;   android:background="#3700B3"

&#x20;   android:orientation="vertical"

&#x20;   android:gravity="center"

&#x20;   android:padding="24dp">



<TextView

android:id="@+id/tvTitle"

android:layout\_width="wrap\_content"

android:layout\_height="wrap\_content"

android:text="Welcome Back"

android:textSize="24sp"

android:textStyle="bold"

android:textColor="#FFFFFFFF"

android:layout\_marginBottom="24dp" />



<EditText

android:id="@+id/etName"

android:layout\_width="match\_parent"

android:layout\_height="wrap\_content"

android:hint="Email ID"

android:inputType="textPersonName"

android:padding="12dp"

android:background="#FFFFFFFF"

android:textColor="#000000"

android:textColorHint="#757575"

android:layout\_marginBottom="16dp" />



<EditText

android:id="@+id/etPassword"

android:layout\_width="match\_parent"

android:layout\_height="wrap\_content"

android:hint="Enter your password"

android:inputType="textPassword"

android:padding="12dp"

android:background="#FFFFFF"

android:textColorHint="#757575"

android:layout\_marginBottom="16dp" />





<CheckBox 

&#x20;      android:id="@+id/checkbox\_meat"
        android:layout\_width="wrap\_content"
        android:layout\_height="wrap\_content"
        android:text="@string/Remember me"
        android:onClick="onCheckboxClicked“ />



<Button

android:id="@+id/btnLogin"

android:layout\_width="match\_parent"

android:layout\_height="wrap\_content"

android:text="Login" />





&#x20; </LinearLayout>



















package com.example.myfirstp



import android.os.Bundle

import androidx.activity.ComponentActivity

import androidx.activity.compose.setContent

import androidx.activity.enableEdgeToEdge

import androidx.compose.foundation.layout.fillMaxSize

import androidx.compose.foundation.layout.padding

import androidx.compose.material3.Scaffold

import androidx.compose.material3.Text

import androidx.compose.runtime.Composable

import androidx.compose.ui.Modifier

import androidx.compose.ui.tooling.preview.Preview

import com.example.myfirstp.ui.theme.MyFirstPTheme



class MainActivity : ComponentActivity() {

&#x20;   override fun onCreate(savedInstanceState: Bundle?) {

&#x20;       super.onCreate(savedInstanceState)

&#x20;       enableEdgeToEdge()

&#x20;       setContent {

&#x20;           MyFirstPTheme {

&#x20;               Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->

&#x20;                   Greeting(

&#x20;                       name = "Android",

&#x20;                       modifier = Modifier.padding(innerPadding)

&#x20;                   )

&#x20;               }

&#x20;           }

&#x20;       }

&#x20;   }

}



@Composable

fun Greeting(name: String, modifier: Modifier = Modifier) {

&#x20;   Text(

&#x20;       text = "Hello $name!",

&#x20;       modifier = modifier

&#x20;   )

}



@Preview(showBackground = true)

@Composable

fun GreetingPreview() {

&#x20;   MyFirstPTheme {

&#x20;       Greeting("Android")





