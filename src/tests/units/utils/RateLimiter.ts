tests.register("RateLimiter", 1, () => {
    const rateLimiter = new RateLimiter(3, 100);

    function testRateLimiter() {
        Assert.truth(rateLimiter.acquire());
        Assert.truth(rateLimiter.acquire());
        Assert.truth(rateLimiter.acquire());
        Assert.truth(!rateLimiter.acquire());
        Assert.truth(!rateLimiter.acquire());
    }

    timeControl(addTime => {
        testRateLimiter();

        addTime(10);
        Assert.truth(!rateLimiter.acquire(), { message: "The interval hasn't expired yet" });

        addTime(90);
        // the rate limiter interval has expired, let's test again
        testRateLimiter();
    });
});
