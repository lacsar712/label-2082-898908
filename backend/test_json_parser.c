#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "json_parser.h"
#include "database.h"
#include "logger.h"

static int total_tests = 0;
static int passed_tests = 0;
static int failed_tests = 0;

#define TEST_ASSERT(cond, msg, ...) do { \
    total_tests++; \
    if (cond) { \
        passed_tests++; \
        printf("  [PASS] %s\n", msg); \
    } else { \
        failed_tests++; \
        printf("  [FAIL] %s: ", msg); \
        printf(__VA_ARGS__); \
        printf("\n"); \
    } \
} while(0)

#define TEST_SUITE(name) printf("\n=== Test Suite: %s ===\n", name)

static void test_parse_json_normal(void) {
    TEST_SUITE("parse_json_string - 正常解析");

    char output[256];

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"username\":\"alice\",\"password\":\"123456\"}", "username", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "alice") == 0, "解析 username=alice",
        "expected 'alice', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"username\":\"alice\",\"password\":\"123456\"}", "password", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "123456") == 0, "解析 password=123456",
        "expected '123456', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"name\":  \"test_value\"  }", "name", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "test_value") == 0, "带多余空格的字段解析",
        "expected 'test_value', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"a\":\"1\",\"b\":\"2\",\"c\":\"3\"}", "b", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "2") == 0, "多字段中解析中间字段 b=2",
        "expected '2', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"category\":\"食品饮料\"}", "category", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "食品饮料") == 0, "解析中文字段值",
        "expected '食品饮料', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"id\":\"12345\",\"reward\":\"10.50\"}", "reward", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "10.50") == 0, "解析数值型字符串 reward=10.50",
        "expected '10.50', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"key_with_underscore\":\"hello_world\"}", "key_with_underscore", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "hello_world") == 0, "解析带下划线的 key",
        "expected 'hello_world', got '%s'", output);
}

static void test_parse_json_missing_field(void) {
    TEST_SUITE("parse_json_string - 缺失字段");

    char output[256];

    memset(output, 0xAA, sizeof(output));
    output[0] = '\0';
    parse_json_string("{\"username\":\"alice\"}", "nonexistent", output, sizeof(output));
    TEST_ASSERT(output[0] == '\0', "缺失字段时 output 不被修改（空初始值）",
        "expected empty string, got '%s'", output);

    const char *preset = "PRESET_VALUE";
    strncpy(output, preset, sizeof(output) - 1);
    output[sizeof(output) - 1] = '\0';
    parse_json_string("{\"a\":\"1\"}", "missing_key", output, sizeof(output));
    TEST_ASSERT(strcmp(output, preset) == 0, "缺失字段时 output 保持原值",
        "expected '%s', got '%s'", preset, output);

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("{}", "anything", output, sizeof(output));
    TEST_ASSERT(output[0] == '\0', "空 JSON 对象 {} 中查找字段",
        "expected empty, got '%s'", output);
}

static void test_parse_json_empty_string(void) {
    TEST_SUITE("parse_json_string - 空字符串");

    char output[256];

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"empty\":\"\"}", "empty", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "") == 0, "解析空字符串值 \"\":\"\"",
        "expected empty string, got '%s' (len=%zu)", output, strlen(output));

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"name\":\"\",\"next\":\"after\"}", "name", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "") == 0, "解析空字符串后仍能正确解析后续字段",
        "expected empty, got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"name\":\"\",\"next\":\"after\"}", "next", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "after") == 0, "空字符串字段后的字段解析正确",
        "expected 'after', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    output[0] = 'X';
    output[1] = '\0';
    parse_json_string("", "any", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "X") == 0, "body 为空字符串时不修改 output",
        "expected 'X', got '%s'", output);
}

static void test_parse_json_truncation(void) {
    TEST_SUITE("parse_json_string - 超长截断");

    char output[256];
    char long_value[512];
    char body[1024];

    memset(long_value, 'A', sizeof(long_value) - 1);
    long_value[sizeof(long_value) - 1] = '\0';
    snprintf(body, sizeof(body), "{\"data\":\"%s\"}", long_value);

    memset(output, 0xFF, sizeof(output));
    parse_json_string(body, "data", output, 10);
    TEST_ASSERT(strlen(output) == 9, "max_len=10 时截断为 9 字符 + null",
        "expected len=9, got len=%zu, value='%s'", strlen(output), output);
    TEST_ASSERT(strncmp(output, long_value, 9) == 0, "截断内容正确（前9个A）",
        "output mismatch");

    memset(output, 0xFF, sizeof(output));
    parse_json_string(body, "data", output, 1);
    TEST_ASSERT(strlen(output) == 0, "max_len=1 时 output 为空（仅 null terminator）",
        "expected len=0, got len=%zu", strlen(output));
    TEST_ASSERT(output[0] == '\0', "max_len=1 时 output[0]='\\0'",
        "output[0]=0x%02X", (unsigned char)output[0]);

    char exact[16];
    memset(exact, 'B', 15);
    exact[15] = '\0';
    snprintf(body, sizeof(body), "{\"key\":\"%s\"}", exact);
    memset(output, 0xFF, sizeof(output));
    parse_json_string(body, "key", output, 16);
    TEST_ASSERT(strlen(output) == 15, "max_len=16 值长=15 时完整保留",
        "expected len=15, got len=%zu", strlen(output));
    TEST_ASSERT(strcmp(output, exact) == 0, "完整保留内容匹配",
        "expected 15 'B's, got '%s'", output);

    char overflow[17];
    memset(overflow, 'C', 16);
    overflow[16] = '\0';
    snprintf(body, sizeof(body), "{\"key\":\"%s\"}", overflow);
    memset(output, 0xFF, sizeof(output));
    parse_json_string(body, "key", output, 16);
    TEST_ASSERT(strlen(output) == 15, "max_len=16 值长=16 时截断为 15",
        "expected len=15, got len=%zu", strlen(output));
    TEST_ASSERT(output[15] == '\0', "截断后末尾有 null 终止符",
        "output[15]=0x%02X", (unsigned char)output[15]);
}

static void test_parse_json_malformed(void) {
    TEST_SUITE("parse_json_string - 畸形 JSON");

    char output[256];

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("not json at all", "key", output, sizeof(output));
    TEST_ASSERT(output[0] == '\0', "完全非 JSON 字符串不修改 output",
        "expected empty, got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"key\":\"value_no_end_quote}", "key", output, sizeof(output));
    size_t len = strlen(output);
    TEST_ASSERT(len > 0, "缺少闭合引号时尽量解析（读取到字符串末尾）",
        "got len=%zu, output='%s'", len, output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"key\":\"val\"ue\"}", "key", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "val") == 0, "值中含额外引号时在第一个引号处截断",
        "expected 'val', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("{\"key\":}", "key", output, sizeof(output));
    TEST_ASSERT(output[0] == '\0', "冒号后无值时返回空/不修改",
        "expected empty, got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("{key:\"no_quotes\"}", "key", output, sizeof(output));
    TEST_ASSERT(output[0] == '\0', "key 无引号时无法匹配",
        "expected empty, got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"username\":\"abc\", \"username\":\"def\"}", "username", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "abc") == 0, "重复 key 取第一个匹配",
        "expected 'abc', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"a\":\"{\\\"b\\\":\\\"c\\\"}\"}", "a", output, sizeof(output));
    TEST_ASSERT(strncmp(output, "{\\", 2) == 0, "嵌套 JSON 字符串作为值解析",
        "expected nested json start, got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("{\"prefix_username\":\"bad\",\"username\":\"good\"}", "username", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "good") == 0, "子串 key 不造成误匹配",
        "expected 'good', got '%s'", output);
}

static void test_url_decode_normal(void) {
    TEST_SUITE("url_decode - 正常解码");

    char dst[256];

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "hello");
    TEST_ASSERT(strcmp(dst, "hello") == 0, "普通字符原样保留",
        "expected 'hello', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "hello+world");
    TEST_ASSERT(strcmp(dst, "hello world") == 0, "+ 号解码为空格",
        "expected 'hello world', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%E4%B8%AD%E6%96%87");
    TEST_ASSERT(strcmp(dst, "中文") == 0, "UTF-8 中文编码解码",
        "expected '中文', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "name%3Dvalue%26key%3D123");
    TEST_ASSERT(strcmp(dst, "name=value&key=123") == 0, "%3D=%  %26=& 解码",
        "expected 'name=value&key=123', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "a+b+c");
    TEST_ASSERT(strcmp(dst, "a b c") == 0, "多个 + 号全部替换",
        "expected 'a b c', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%20%2F%3F%25");
    TEST_ASSERT(strcmp(dst, " /?%") == 0, "空格/斜杠/问号/百分号解码",
        "expected ' /?%%', got '%s'", dst);
}

static void test_url_decode_edge(void) {
    TEST_SUITE("url_decode - 边界与异常");

    char dst[256];

    memset(dst, 0xFF, sizeof(dst));
    dst[0] = 'X';
    dst[1] = '\0';
    url_decode(dst, "");
    TEST_ASSERT(strcmp(dst, "") == 0, "空输入解码为空",
        "expected empty, got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%2");
    TEST_ASSERT(strcmp(dst, "%2") == 0, "不完整的 % 编码（末尾）保留原样",
        "expected '%%2', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%");
    TEST_ASSERT(strcmp(dst, "%") == 0, "单独 % 字符保留原样",
        "expected '%%', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%%41");
    TEST_ASSERT(strcmp(dst, "%A") == 0, "双 %% 后接编码",
        "expected '%%A', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%GG");
    TEST_ASSERT(strcmp(dst, "%GG") == 0, "非法十六进制字符 %GG 保留原样",
        "expected '%%GG', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%Gg%1z");
    TEST_ASSERT(strcmp(dst, "%Gg%1z") == 0, "混合非法十六进制保留原样",
        "expected '%%Gg%%1z', got '%s'", dst);

    memset(dst, 0xFF, sizeof(dst));
    char expected_mixed[] = {'a',' ','b',' ','c','%','d',(char)0xe0,'f','\0'};
    url_decode(dst, "a%20b+c%d%e0f");
    TEST_ASSERT(strcmp(dst, expected_mixed) == 0, "合法编码 + 非法编码混合 (%d%% 保留+%%e0解码)",
        "expected mixed, got bytes: %02X %02X %02X %02X %02X %02X %02X %02X %02X",
        (unsigned char)dst[0], (unsigned char)dst[1], (unsigned char)dst[2],
        (unsigned char)dst[3], (unsigned char)dst[4], (unsigned char)dst[5],
        (unsigned char)dst[6], (unsigned char)dst[7], (unsigned char)dst[8]);

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "++++++++");
    TEST_ASSERT(strcmp(dst, "        ") == 0, "连续 + 号全部变空格",
        "expected 8 spaces, got len=%zu", strlen(dst));

    memset(dst, 0xFF, sizeof(dst));
    url_decode(dst, "%00%01%02");
    TEST_ASSERT(dst[0] == 0x00 && dst[1] == 0x01 && dst[2] == 0x02,
        "控制字符解码 (%00 %01 %02)",
        "dst[0]=0x%02X dst[1]=0x%02X dst[2]=0x%02X",
        (unsigned char)dst[0], (unsigned char)dst[1], (unsigned char)dst[2]);
}

static void test_parse_json_search_key_edge(void) {
    TEST_SUITE("parse_json_string - key 匹配边界");

    char output[256];

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"status\":\"pending\"}", "status", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "pending") == 0, "解析 status=pending",
        "expected 'pending', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("{\"Status\":\"case_sensitive\"}", "status", output, sizeof(output));
    TEST_ASSERT(output[0] == '\0', "key 大小写敏感匹配",
        "expected empty, got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    output[0] = '\0';
    parse_json_string("{\"\": \"empty_key_value\"}", "", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "empty_key_value") == 0, "空字符串 key 解析",
        "expected 'empty_key_value', got '%s'", output);

    char long_key[200];
    memset(long_key, 'k', 198);
    long_key[198] = '\0';
    char body[512];
    snprintf(body, sizeof(body), "{\"%s\":\"long_key_ok\"}", long_key);
    memset(output, 0xFF, sizeof(output));
    parse_json_string(body, long_key, output, sizeof(output));
    TEST_ASSERT(strcmp(output, "long_key_ok") == 0, "超长 key (198 chars) 解析",
        "expected 'long_key_ok', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"a\" :  \"spaced\"}", "a", output, sizeof(output));
    TEST_ASSERT(strcmp(output, "spaced") == 0, "多种分隔符空格组合",
        "expected 'spaced', got '%s'", output);

    memset(output, 0xFF, sizeof(output));
    parse_json_string("{\"a\":\n\"newline_value\"}", "a", output, sizeof(output));
    TEST_ASSERT(strncmp(output, "newline_value", 13) == 0, "换行分隔冒号和值",
        "expected 'newline_value', got '%s'", output);
}

int main(void) {
    printf("========================================\n");
    printf("  JSON Parser Unit Tests\n");
    printf("========================================\n");

    user_count = 0;
    order_count = 0;
    cert_app_count = 0;
    blacklist_count = 0;
    event_count = 0;
    subscription_count = 0;
    notification_count = 0;
    thread_count = 0;
    message_count = 0;

    test_parse_json_normal();
    test_parse_json_missing_field();
    test_parse_json_empty_string();
    test_parse_json_truncation();
    test_parse_json_malformed();
    test_parse_json_search_key_edge();
    test_url_decode_normal();
    test_url_decode_edge();

    printf("\n========================================\n");
    printf("  Test Summary\n");
    printf("========================================\n");
    printf("  Total:  %d\n", total_tests);
    printf("  Passed: %d\n", passed_tests);
    printf("  Failed: %d\n", failed_tests);
    printf("========================================\n");

    if (failed_tests > 0) {
        printf("\n[RESULT] SOME TESTS FAILED\n");
        return 1;
    } else {
        printf("\n[RESULT] ALL TESTS PASSED\n");
        return 0;
    }
}
