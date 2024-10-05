tests.register("RateLimiter", 1, () => {
    const rateLimiter = new RateLimiter(3, 100);

    function testRateLimiter() {
        Assert.assert(rateLimiter.acquire());
        Assert.assert(rateLimiter.acquire());
        Assert.assert(rateLimiter.acquire());
        Assert.assert(!rateLimiter.acquire());
        Assert.assert(!rateLimiter.acquire());
    }

    timeControl(addTime => {
        testRateLimiter();

        addTime(10);
        Assert.assert(!rateLimiter.acquire(), { message: "The interval hasn't expired yet" });

        addTime(90);
        // the rate limiter interval has expired, let's test again
        testRateLimiter();
    });
});
