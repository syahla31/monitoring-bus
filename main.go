package main

import "github.com/gin-gonic/gin"

func main() {
    router := gin.Default()

    router.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Monitoring Bus API is running!",
        })
    })

    router.Run("127.0.0.1:8080")
}