let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @returns {string}
*/
export function version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.version(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
* WASM panic hook 초기화 (한 번만 실행)
*/
export function init_panic_hook() {
    wasm.init_panic_hook();
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* HWP 파일에서 썸네일 이미지만 경량 추출 (전체 파싱 없이)
*
* 반환: JSON `{ "format": "png"|"gif", "base64": "...", "width": N, "height": N }`
* PrvImage가 없으면 `null` 반환
* @param {Uint8Array} data
* @returns {any}
*/
export function extractThumbnail(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.extractThumbnail(ptr0, len0);
    return takeObject(ret);
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const HwpDocumentFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hwpdocument_free(ptr >>> 0));
/**
* WASM에서 사용할 HWP 문서 래퍼
*
* 도메인 로직은 `DocumentCore`에 구현되어 있으며,
* `Deref`/`DerefMut`를 통해 투명하게 접근한다.
*/
export class HwpDocument {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HwpDocument.prototype);
        obj.__wbg_ptr = ptr;
        HwpDocumentFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HwpDocumentFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hwpdocument_free(ptr);
    }
    /**
    * 문서를 HWP 바이너리로 내보낸다.
    *
    * Document IR을 HWP 5.0 CFB 바이너리로 직렬화하여 반환한다.
    * HWPX 출처 문서는 `export_hwp_with_adapter` 를 통해 HWPX→HWP IR 매핑 어댑터를
    * 자동 적용하여 한컴 호환성과 자기 재로드 페이지 보존을 보장한다 (#178).
    * HWP 출처는 어댑터가 no-op 이므로 기존 동작과 동일.
    * @returns {Uint8Array}
    */
    exportHwp() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_exportHwp(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 총 페이지 수를 반환한다.
    * @returns {number}
    */
    pageCount() {
        const ret = wasm.hwpdocument_pageCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * HTML 문자열을 파싱하여 캐럿 위치에 삽입한다 (본문).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {string} html
    * @returns {string}
    */
    pasteHtml(section_idx, para_idx, char_offset, html) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(html, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_pasteHtml(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 스타일을 적용한다 (본문 문단).
    * @param {number} sec_idx
    * @param {number} para_idx
    * @param {number} style_id
    * @returns {string}
    */
    applyStyle(sec_idx, para_idx, style_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_applyStyle(retptr, this.__wbg_ptr, sec_idx, para_idx, style_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Batch 모드를 시작한다. 이후 Command 호출 시 paginate()를 건너뛴다.
    * @returns {string}
    */
    beginBatch() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_beginBatch(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문단에서 텍스트를 삭제한다.
    *
    * 삭제 후 구역을 재구성하고 재페이지네이션한다.
    * 반환값: JSON `{"ok":true,"charOffset":<offset_after_delete>}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    deleteText(section_idx, para_idx, char_offset, count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteText(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Document IR을 HWPX(ZIP+XML)로 직렬화하여 반환한다.
    * @returns {Uint8Array}
    */
    exportHwpx() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_exportHwpx(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 문단에 텍스트를 삽입한다.
    *
    * 삽입 후 구역을 재구성하고 재페이지네이션한다.
    * 반환값: JSON `{"ok":true,"charOffset":<new_offset>}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {string} text
    * @returns {string}
    */
    insertText(section_idx, para_idx, char_offset, text) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertText(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 전체 치환
    * @param {string} query
    * @param {string} new_text
    * @param {boolean} case_sensitive
    * @returns {string}
    */
    replaceAll(query, new_text, case_sensitive) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(new_text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_replaceAll(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, case_sensitive);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 단일 치환 (검색어 기반) — 첫 번째 매치만 교체
    * @param {string} query
    * @param {string} new_text
    * @param {boolean} case_sensitive
    * @returns {string}
    */
    replaceOne(query, new_text, case_sensitive) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(new_text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_replaceOne(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, case_sensitive);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 문서 텍스트 검색
    * @param {string} query
    * @param {number} from_sec
    * @param {number} from_para
    * @param {number} from_char
    * @param {boolean} forward
    * @param {boolean} case_sensitive
    * @returns {string}
    */
    searchText(query, from_sec, from_para, from_char, forward, case_sensitive) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_searchText(retptr, this.__wbg_ptr, ptr0, len0, from_sec, from_para, from_char, forward, case_sensitive);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 책갈피 추가
    * @param {number} sec
    * @param {number} para
    * @param {number} char_offset
    * @param {string} name
    * @returns {string}
    */
    addBookmark(sec, para, char_offset, name) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_addBookmark(retptr, this.__wbg_ptr, sec, para, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 컨트롤 객체(표, 이미지, 도형)를 내부 클립보드에 복사한다.
    *
    * [Task #1161] `cell_path_json` 이 빈 문자열/`"[]"` 면 본문, 그 외에는 셀/글상자
    * 경로(`[{"controlIndex","cellIndex","cellParaIndex"}, ...]`)의 컨트롤을 복사한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {string} cell_path_json
    * @param {number} control_idx
    * @returns {string}
    */
    copyControl(section_idx, para_idx, cell_path_json, control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_copyControl(retptr, this.__wbg_ptr, section_idx, para_idx, ptr0, len0, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 빈 문서 생성 (테스트/미리보기용)
    * @returns {HwpDocument}
    */
    static createEmpty() {
        const ret = wasm.hwpdocument_createEmpty();
        return HwpDocument.__wrap(ret);
    }
    /**
    * 새 스타일을 생성한다.
    *
    * json: {"name":"...", "englishName":"...", "type":0, "nextStyleId":0}
    * 반환값: 새 스타일 ID (0-based)
    * @param {string} json
    * @returns {number}
    */
    createStyle(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_createStyle(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
    * 커서 위치에 새 표를 삽입한다.
    *
    * 반환: JSON `{"ok":true,"paraIdx":<N>,"controlIdx":0}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {number} row_count
    * @param {number} col_count
    * @returns {string}
    */
    createTable(section_idx, para_idx, char_offset, row_count, col_count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_createTable(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, row_count, col_count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 본문 선택 영역을 삭제한다.
    *
    * 반환: JSON `{"ok":true,"paraIdx":N,"charOffset":N}`
    * @param {number} section_idx
    * @param {number} start_para_idx
    * @param {number} start_char_offset
    * @param {number} end_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    deleteRange(section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteRange(retptr, this.__wbg_ptr, section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 스타일을 삭제한다.
    *
    * 바탕글(ID 0)은 삭제할 수 없다.
    * 삭제된 스타일을 사용 중인 문단은 바탕글(ID 0)로 변경된다.
    * @param {number} style_id
    * @returns {boolean}
    */
    deleteStyle(style_id) {
        const ret = wasm.hwpdocument_deleteStyle(this.__wbg_ptr, style_id);
        return ret !== 0;
    }
    /**
    * 구역의 용지 설정(PageDef)을 HWPUNIT 원본값으로 반환한다.
    * @param {number} section_idx
    * @returns {string}
    */
    getPageDef(section_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageDef(retptr, this.__wbg_ptr, section_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 특정 문단의 스타일을 조회한다.
    *
    * 반환값: JSON { id, name }
    * @param {number} sec_idx
    * @param {number} para_idx
    * @returns {string}
    */
    getStyleAt(sec_idx, para_idx) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getStyleAt(retptr, this.__wbg_ptr, sec_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 선택된 개체들을 하나의 GroupShape로 묶는다.
    * json: `{"sectionIdx":N, "targets":[{"paraIdx":N,"controlIdx":N},...]}`
    * 반환: JSON `{"ok":true, "paraIdx":N, "controlIdx":N}`
    * @param {string} json
    * @returns {string}
    */
    groupShapes(json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_groupShapes(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 텍스트 치환 (단일)
    * @param {number} sec
    * @param {number} para
    * @param {number} char_offset
    * @param {number} length
    * @param {string} new_text
    * @returns {string}
    */
    replaceText(sec, para, char_offset, length, new_text) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(new_text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_replaceText(retptr, this.__wbg_ptr, sec, para, char_offset, length, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 구역의 용지 설정(PageDef)을 변경하고 재페이지네이션한다.
    * @param {number} section_idx
    * @param {string} json
    * @returns {string}
    */
    setPageDef(section_idx, json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setPageDef(retptr, this.__wbg_ptr, section_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 스타일의 메타 정보(이름/영문이름/nextStyleId)를 수정한다.
    *
    * json: {"name":"...", "englishName":"...", "nextStyleId":0}
    * @param {number} style_id
    * @param {string} json
    * @returns {boolean}
    */
    updateStyle(style_id, json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_updateStyle(this.__wbg_ptr, style_id, ptr0, len0);
        return ret !== 0;
    }
    /**
    * 문서 내 모든 책갈피 목록 반환
    * @returns {string}
    */
    getBookmarks() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getBookmarks(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 셀의 행/열/병합 정보를 반환한다.
    *
    * 반환: JSON `{"row":N,"col":N,"rowSpan":N,"colSpan":N}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @returns {string}
    */
    getCellInfo(section_idx, parent_para_idx, control_idx, cell_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellInfo(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 현재 이벤트 로그를 JSON으로 반환한다.
    * @returns {string}
    */
    getEventLog() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getEventLog(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 문단 내 줄 정보를 반환한다 (커서 수직 이동/Home/End용).
    *
    * 반환: JSON `{"lineIndex":N,"lineCount":N,"charStart":N,"charEnd":N}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getLineInfo(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getLineInfo(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 감추기 조회
    * @param {number} sec
    * @param {number} para
    * @returns {string}
    */
    getPageHide(sec, para) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageHide(retptr, this.__wbg_ptr, sec, para);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 페이지 정보를 JSON 문자열로 반환한다.
    * @param {number} page_num
    * @returns {string}
    */
    getPageInfo(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageInfo(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 수직 커서 이동 (ArrowUp/Down) — 단일 호출로 줄/문단/표/구역 경계를 모두 처리한다.
    *
    * delta: -1=위, +1=아래
    * preferred_x: 이전 반환값의 preferredX (최초 이동 시 -1.0 전달)
    * 셀 컨텍스트: 본문이면 모두 0xFFFFFFFF 전달
    *
    * 반환: JSON `{DocumentPosition + CursorRect + preferredX}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {number} delta
    * @param {number} preferred_x
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @returns {string}
    */
    moveVertical(section_idx, para_idx, char_offset, delta, preferred_x, parent_para_idx, control_idx, cell_idx, cell_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_moveVertical(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, delta, preferred_x, parent_para_idx, control_idx, cell_idx, cell_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 내부 클립보드의 컨트롤 객체를 캐럿 위치에 붙여넣는다.
    *
    * 반환값: JSON `{"ok":true,"paraIdx":<idx>,"controlIdx":0}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    pasteControl(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_pasteControl(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Document 스냅샷을 저장하고 ID를 반환한다.
    * @returns {number}
    */
    saveSnapshot() {
        const ret = wasm.hwpdocument_saveSnapshot(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 파일 이름을 설정한다 (머리말/꼬리말 필드 치환용).
    * @param {string} name
    */
    setFileName(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.hwpdocument_setFileName(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * 감추기 설정
    * @param {number} sec
    * @param {number} para
    * @param {boolean} hide_header
    * @param {boolean} hide_footer
    * @param {boolean} hide_master
    * @param {boolean} hide_border
    * @param {boolean} hide_fill
    * @param {boolean} hide_page_num
    * @returns {string}
    */
    setPageHide(sec, para, hide_header, hide_footer, hide_master, hide_border, hide_fill, hide_page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_setPageHide(retptr, this.__wbg_ptr, sec, para, hide_header, hide_footer, hide_master, hide_border, hide_fill, hide_page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * GroupShape를 풀어 자식 개체들을 개별로 복원한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    ungroupShape(section_idx, para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_ungroupShape(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 선택 영역을 내부 클립보드에 복사한다.
    *
    * 반환값: JSON `{"ok":true,"text":"<plain_text>"}`
    * @param {number} section_idx
    * @param {number} start_para_idx
    * @param {number} start_char_offset
    * @param {number} end_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    copySelection(section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_copySelection(retptr, this.__wbg_ptr, section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 현재 구역의 다단 설정을 JSON으로 반환한다.
    * @param {number} section_idx
    * @returns {string}
    */
    getColumnDef(section_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getColumnDef(retptr, this.__wbg_ptr, section_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서 내 모든 필드 목록을 JSON 배열로 반환한다.
    *
    * 반환: `[{fieldId, fieldType, name, guide, command, value, location}]`
    * @returns {string}
    */
    getFieldList() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFieldList(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 양식 개체 값을 조회한다.
    *
    * 반환: `{ok, formType, name, value, text, caption, enabled}`
    * @param {number} sec
    * @param {number} para
    * @param {number} ci
    * @returns {string}
    */
    getFormValue(sec, para, ci) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFormValue(retptr, this.__wbg_ptr, sec, para, ci);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * [Task #919] 글상자/도형 컨트롤의 페이지 좌표 바운딩박스를 반환한다.
    *
    * 반환: JSON `{"pageIndex":<N>,"x":<f>,"y":<f>,"width":<f>,"height":<f>}`
    * studio 의 `isShapeBorderClick` 헬퍼에서 외곽 경계선 클릭 판별에 사용.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getShapeBBox(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getShapeBBox(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서에 정의된 스타일 목록을 조회한다.
    *
    * 반환값: JSON 배열 [{ id, name, englishName, type, paraShapeId, charShapeId }, ...]
    * @returns {string}
    */
    getStyleList() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getStyleList(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 표 전체의 바운딩박스를 반환한다.
    *
    * 반환: JSON `{"pageIndex":<N>,"x":<f>,"y":<f>,"width":<f>,"height":<f>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getTableBBox(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getTableBBox(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문단에서 텍스트 부분 문자열을 반환한다 (Undo용 텍스트 보존).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    getTextRange(section_idx, para_idx, char_offset, count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getTextRange(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 미주를 삽입한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    insertEndnote(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertEndnote(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 커서 위치에 그림을 삽입한다.
    *
    * image_data: 이미지 바이너리 데이터 (PNG/JPG/GIF/BMP 등)
    * width, height: HWPUNIT 단위 크기
    * extension: 파일 확장자 (jpg, png 등)
    *
    * 반환:
    * - 본문 inline: `{"ok":true,"paraIdx":<N>,"controlIdx":0}`
    * - 셀 floating (#1151): `{"ok":true,"paraIdx":<table_para>,"controlIdx":<new_sibling_idx>}`
    *
    * `cell_path_json` 이 빈 문자열 또는 `"[]"` 면 본문 inline 삽입. 그 외에는
    * 표 셀 영역에 floating picture (한컴 정합) 로 삽입한다.
    * 예: `[{"controlIndex":0,"cellIndex":2,"cellParaIndex":0}]`
    * [Task #1151 v8 결함 C] `paper_offset_x_hu / paper_offset_y_hu` 는 사용자가 셀 안에
    * 클릭/드래그한 위치 (paper-relative HU). studio 의 finishImagePlacement 가 drag 좌표를
    * 변환하여 전달. JS 측에서 `undefined` 전달 시 (또는 음수) wasm 이 셀 좌상단을 default 사용
    * — 기존 동작 호환.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {string} cell_path_json
    * @param {Uint8Array} image_data
    * @param {number} width
    * @param {number} height
    * @param {number} natural_width_px
    * @param {number} natural_height_px
    * @param {string} extension
    * @param {string} description
    * @param {number | undefined} [paper_offset_x_hu]
    * @param {number | undefined} [paper_offset_y_hu]
    * @returns {string}
    */
    insertPicture(section_idx, para_idx, char_offset, cell_path_json, image_data, width, height, natural_width_px, natural_height_px, extension, description, paper_offset_x_hu, paper_offset_y_hu) {
        let deferred6_0;
        let deferred6_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(image_data, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(extension, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            const ptr3 = passStringToWasm0(description, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len3 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertPicture(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, ptr0, len0, ptr1, len1, width, height, natural_width_px, natural_height_px, ptr2, len2, ptr3, len3, !isLikeNone(paper_offset_x_hu), isLikeNone(paper_offset_x_hu) ? 0 : paper_offset_x_hu, !isLikeNone(paper_offset_y_hu), isLikeNone(paper_offset_y_hu) ? 0 : paper_offset_y_hu);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr5 = r0;
            var len5 = r1;
            if (r3) {
                ptr5 = 0; len5 = 0;
                throw takeObject(r2);
            }
            deferred6_0 = ptr5;
            deferred6_1 = len5;
            return getStringFromWasm0(ptr5, len5);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred6_0, deferred6_1, 1);
        }
    }
    /**
    * 내부 클립보드의 내용을 캐럿 위치에 붙여넣는다 (본문 문단).
    *
    * 반환값: JSON `{"ok":true,"paraIdx":<idx>,"charOffset":<offset>}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    pasteInternal(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_pasteInternal(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 다단 설정 변경
    * column_type: 0=일반, 1=배분, 2=평행
    * same_width: 0=다른 너비, 1=같은 너비
    * @param {number} section_idx
    * @param {number} column_count
    * @param {number} column_type
    * @param {number} same_width
    * @param {number} spacing_hu
    * @returns {string}
    */
    setColumnDef(section_idx, column_count, column_type, same_width, spacing_hu) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_setColumnDef(retptr, this.__wbg_ptr, section_idx, column_count, column_type, same_width, spacing_hu);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 양식 개체 값을 설정한다.
    *
    * value_json: `{"value":1}` 또는 `{"text":"입력값"}`
    * 반환: `{ok}`
    * @param {number} sec
    * @param {number} para
    * @param {number} ci
    * @param {string} value_json
    * @returns {string}
    */
    setFormValue(sec, para, ci, value_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(value_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setFormValue(retptr, this.__wbg_ptr, sec, para, ci, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 내부 클립보드를 초기화한다.
    */
    clearClipboard() {
        wasm.hwpdocument_clearClipboard(this.__wbg_ptr);
    }
    /**
    * 커서 위치에 표를 삽입한다 (확장, JSON 옵션).
    *
    * options JSON: { sectionIdx, paraIdx, charOffset, rowCount, colCount,
    *                 treatAsChar?: bool, colWidths?: [u32, ...] }
    * @param {string} options_json
    * @returns {string}
    */
    createTableEx(options_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(options_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_createTableEx(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 책갈피 삭제
    * @param {number} sec
    * @param {number} para
    * @param {number} ctrl_idx
    * @returns {string}
    */
    deleteBookmark(sec, para, ctrl_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteBookmark(retptr, this.__wbg_ptr, sec, para, ctrl_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 본문 각주 컨트롤을 삭제한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    deleteFootnote(section_idx, para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서에 정의된 글머리표(Bullet) 목록을 조회한다.
    *
    * 반환값: JSON 배열 [{ id, char }, ...]
    * id는 1-based (ParaShape.numbering_id와 동일)
    * @returns {string}
    */
    getBulletList() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getBulletList(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 커서 위치의 픽셀 좌표를 반환한다.
    *
    * 반환: JSON `{"pageIndex":N,"x":F,"y":F,"height":F}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getCursorRect(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCursorRect(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * field_id로 필드 값을 조회한다.
    *
    * 반환: `{ok, value}`
    * @param {number} field_id
    * @returns {string}
    */
    getFieldValue(field_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFieldValue(retptr, this.__wbg_ptr, field_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 구역 정의(SectionDef)를 JSON으로 반환한다.
    * @param {number} section_idx
    * @returns {string}
    */
    getSectionDef(section_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getSectionDef(retptr, this.__wbg_ptr, section_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 수식을 삽입한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {string} script
    * @param {number} font_size
    * @param {number} color
    * @returns {string}
    */
    insertEquation(section_idx, para_idx, char_offset, script, font_size, color) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(script, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertEquation(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, ptr0, len0, font_size, color);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 각주를 삽입한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    insertFootnote(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 현재 문단을 이전 문단에 병합한다 (Backspace at start).
    *
    * para_idx의 텍스트가 para_idx-1에 결합되고 para_idx는 삭제된다.
    * 반환값: JSON `{"ok":true,"paraIdx":<merged_para_idx>,"charOffset":<merge_point>}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {string}
    */
    mergeParagraph(section_idx, para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_mergeParagraph(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 사용자 명시 요청에 의한 lineseg 전체 reflow (#177).
    *
    * `reflow_zero_height_paragraphs` 의 자동 경로와 달리, "빈 line_segs + text 존재"
    * 케이스까지 포함해 재계산한다. 반환값은 실제로 reflow 된 문단 개수.
    *
    * 호출 이후 렌더 캐시·페이지네이션이 갱신되므로 즉시 렌더링하면 보정된 결과가 보인다.
    * @returns {number}
    */
    reflowLinesegs() {
        const ret = wasm.hwpdocument_reflowLinesegs(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 책갈피 이름 변경
    * @param {number} sec
    * @param {number} para
    * @param {number} ctrl_idx
    * @param {string} new_name
    * @returns {string}
    */
    renameBookmark(sec, para, ctrl_idx, new_name) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(new_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_renameBookmark(retptr, this.__wbg_ptr, sec, para, ctrl_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 특정 페이지를 SVG 문자열로 렌더링한다.
    * @param {number} page_num
    * @returns {string}
    */
    renderPageSvg(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_renderPageSvg(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서 전체 검색 (모든 매치 반환)
    * @param {string} query
    * @param {boolean} case_sensitive
    * @param {boolean} include_cells
    * @returns {string}
    */
    searchAllText(query, case_sensitive, include_cells) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_searchAllText(retptr, this.__wbg_ptr, ptr0, len0, case_sensitive, include_cells);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * field_id로 필드 값을 설정한다.
    *
    * 반환: `{ok, fieldId, oldValue, newValue}`
    * @param {number} field_id
    * @param {string} value
    * @returns {string}
    */
    setFieldValue(field_id, value) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setFieldValue(retptr, this.__wbg_ptr, field_id, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 구역 정의(SectionDef)를 변경하고 재페이지네이션한다.
    * @param {number} section_idx
    * @param {string} json
    * @returns {string}
    */
    setSectionDef(section_idx, json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setSectionDef(retptr, this.__wbg_ptr, section_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 캐럿 위치에서 문단을 분할한다 (Enter 키).
    *
    * char_offset 이후의 텍스트가 새 문단으로 이동한다.
    * 반환값: JSON `{"ok":true,"paraIdx":<new_para_idx>,"charOffset":0}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    splitParagraph(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitParagraph(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 스타일을 적용한다 (셀 내 문단).
    * @param {number} sec_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} style_id
    * @returns {string}
    */
    applyCellStyle(sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, style_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_applyCellStyle(retptr, this.__wbg_ptr, sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, style_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * JSON으로 지정된 번호 형식으로 Numbering 정의를 생성한다.
    *
    * json: {"levelFormats":["^1.","^2)",...],"numberFormats":[0,8,...],"startNumber":1}
    * 반환값: Numbering ID (1-based)
    * @param {string} json
    * @returns {number}
    */
    createNumbering(json) {
        const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_createNumbering(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {string}
    */
    deleteParagraph(section_idx, para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteParagraph(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표에서 행을 삭제한다.
    *
    * 반환값: JSON `{"ok":true,"rowCount":<N>,"colCount":<M>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} row_idx
    * @returns {string}
    */
    deleteTableRow(section_idx, parent_para_idx, control_idx, row_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteTableRow(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, row_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 지정 ID의 스냅샷을 제거하여 메모리를 해제한다.
    * @param {number} id
    */
    discardSnapshot(id) {
        wasm.hwpdocument_discardSnapshot(this.__wbg_ptr, id);
    }
    /**
    * 특정 스타일의 CharShape/ParaShape 속성을 상세 조회한다.
    *
    * 반환값: JSON { charProps: {...}, paraProps: {...} }
    * @param {number} style_id
    * @returns {string}
    */
    getStyleDetail(style_id) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getStyleDetail(retptr, this.__wbg_ptr, style_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 표 셀 내 문단에서 텍스트 부분 문자열을 반환한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    getTextInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getTextInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {string}
    */
    insertParagraph(section_idx, para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertParagraph(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표에 행을 삽입한다.
    *
    * 반환값: JSON `{"ok":true,"rowCount":<N>,"colCount":<M>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} row_idx
    * @param {boolean} below
    * @returns {string}
    */
    insertTableRow(section_idx, parent_para_idx, control_idx, row_idx, below) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertTableRow(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, row_idx, below);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 특정 페이지를 HTML 문자열로 렌더링한다.
    * @param {number} page_num
    * @returns {string}
    */
    renderPageHtml(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_renderPageHtml(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 지정 ID의 스냅샷으로 Document를 복원한다.
    * @param {number} id
    * @returns {string}
    */
    restoreSnapshot(id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_restoreSnapshot(retptr, this.__wbg_ptr, id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {boolean} enabled
    */
    setClipEnabled(enabled) {
        wasm.hwpdocument_setClipEnabled(this.__wbg_ptr, enabled);
    }
    /**
    * 병합된 셀을 나눈다 (split).
    *
    * 반환값: JSON `{"ok":true,"cellCount":<N>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} row
    * @param {number} col
    * @returns {string}
    */
    splitTableCell(section_idx, parent_para_idx, control_idx, row, col) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitTableCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, row, col);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 글자 서식을 적용한다 (본문 문단).
    * @param {number} sec_idx
    * @param {number} para_idx
    * @param {number} start_offset
    * @param {number} end_offset
    * @param {string} props_json
    * @returns {string}
    */
    applyCharFormat(sec_idx, para_idx, start_offset, end_offset, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyCharFormat(retptr, this.__wbg_ptr, sec_idx, para_idx, start_offset, end_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 마당(템플릿)을 적용한다.
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} template_id
    * @returns {string}
    */
    applyHfTemplate(section_idx, is_header, apply_to, template_id) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_applyHfTemplate(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, template_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {number} sec_idx
    * @param {number} para_idx
    * @param {string} props_json
    * @returns {string}
    */
    applyParaFormat(sec_idx, para_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyParaFormat(retptr, this.__wbg_ptr, sec_idx, para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 어댑터 적용 + HWP 직렬화 + 자기 재로드 검증을 수행하고 결과를 JSON 으로 반환한다 (#178).
    *
    * 반환 JSON:
    * ```json
    * {
    *   "bytesLen": 678912,
    *   "pageCountBefore": 9,
    *   "pageCountAfter": 9,
    *   "recovered": true
    * }
    * ```
    *
    * 본 함수는 검증 메타데이터만 반환하며 bytes 자체는 별도 호출 (`exportHwp`) 로 받아야 한다.
    * 검증과 실제 사용을 분리하여 호출자가 결과에 따라 다른 동작을 취할 수 있도록 한다.
    * @returns {string}
    */
    exportHwpVerify() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_exportHwpVerify(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀 내부 문단의 스타일을 조회한다.
    * @param {number} sec_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @returns {string}
    */
    getCellStyleAt(sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellStyleAt(retptr, this.__wbg_ptr, sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 문서 정보를 JSON 문자열로 반환한다.
    * @returns {string}
    */
    getDocumentInfo() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getDocumentInfo(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 미주 모양을 조회한다.
    * @param {number} section_idx
    * @returns {string}
    */
    getEndnoteShape(section_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getEndnoteShape(retptr, this.__wbg_ptr, section_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 현재 대체 폰트 경로를 반환한다.
    * @returns {string}
    */
    getFallbackFont() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFallbackFont(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 각주 정보를 조회한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getFootnoteInfo(section_idx, para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFootnoteInfo(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 조회
    *
    * 반환: JSON `{"ok":true,"exists":true/false,...}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @returns {string}
    */
    getHeaderFooter(section_idx, is_header, apply_to) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 구역(Section) 수를 반환한다.
    * @returns {number}
    */
    getSectionCount() {
        const ret = wasm.hwpdocument_getSectionCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 원본 파일 형식을 반환한다 ("hwp" 또는 "hwpx").
    * @returns {string}
    */
    getSourceFormat() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getSourceFormat(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 각주 영역 히트테스트
    * @param {number} page_num
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    hitTestFootnote(page_num, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_hitTestFootnote(retptr, this.__wbg_ptr, page_num, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 새 번호 지정 컨트롤 삽입 (쪽 > 새 번호로 시작)
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {number} start_num
    * @returns {string}
    */
    insertNewNumber(section_idx, para_idx, char_offset, start_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertNewNumber(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, start_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 강제 쪽 나누기 삽입 (Ctrl+Enter)
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    insertPageBreak(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertPageBreak(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표의 셀을 병합한다.
    *
    * 반환값: JSON `{"ok":true,"cellCount":<N>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} start_row
    * @param {number} start_col
    * @param {number} end_row
    * @param {number} end_col
    * @returns {string}
    */
    mergeTableCells(section_idx, parent_para_idx, control_idx, start_row, start_col, end_row, end_col) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_mergeTableCells(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, start_row, start_col, end_row, end_col);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표의 위치 오프셋(vertical_offset, horizontal_offset)을 이동한다.
    *
    * delta_h, delta_v: HWPUNIT 단위 이동량 (양수=오른쪽/아래, 음수=왼쪽/위)
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} delta_h
    * @param {number} delta_v
    * @returns {string}
    */
    moveTableOffset(section_idx, parent_para_idx, control_idx, delta_h, delta_v) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_moveTableOffset(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, delta_h, delta_v);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 디버그 오버레이 표시 여부를 설정한다.
    * @param {boolean} enabled
    */
    set_debug_overlay(enabled) {
        wasm.hwpdocument_set_debug_overlay(this.__wbg_ptr, enabled);
    }
    /**
    * 대체 폰트 경로를 설정한다.
    * @param {string} path
    */
    setFallbackFont(path) {
        const ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.hwpdocument_setFallbackFont(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * 문서에 저장된 캐럿 위치를 반환한다 (문서 로딩 시 캐럿 자동 배치용).
    *
    * 반환: JSON `{"sectionIndex":N,"paragraphIndex":N,"charOffset":N}`
    * @returns {string}
    */
    getCaretPosition() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCaretPosition(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 내부 클립보드의 플레인 텍스트를 반환한다.
    * @returns {string}
    */
    getClipboardText() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getClipboardText(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 페이지 좌표에서 양식 개체를 찾는다.
    *
    * 반환: `{found, sec, para, ci, formType, name, value, caption, text, bbox}`
    * @param {number} page_num
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    getFormObjectAt(page_num, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFormObjectAt(retptr, this.__wbg_ptr, page_num, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문단의 논리적 길이를 반환한다 (텍스트 문자 + 인라인 컨트롤 수).
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {number}
    */
    getLogicalLength(section_idx, para_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getLogicalLength(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 각주/미주 편집 모드 진입 대상 조회
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getNoteEditInfo(section_idx, para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getNoteEditInfo(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서에 정의된 문단 번호(Numbering) 목록을 조회한다.
    *
    * 반환값: JSON 배열 [{ id, levelFormats: [...] }, ...]
    * id는 1-based (ParaShape.numbering_id와 동일)
    * @returns {string}
    */
    getNumberingList() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getNumberingList(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 문단에 필드 마커를 삽입한다.
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @param {number} char_offset
    * @param {number} field_type
    * @returns {string}
    */
    insertFieldInHf(section_idx, is_header, apply_to, hf_para_idx, char_offset, field_type) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertFieldInHf(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx, char_offset, field_type);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 직선 끝점 이동 (글로벌 HWPUNIT 좌표)
    * @param {number} sec
    * @param {number} para
    * @param {number} ci
    * @param {number} sx
    * @param {number} sy
    * @param {number} ex
    * @param {number} ey
    * @returns {string}
    */
    moveLineEndpoint(sec, para, ci, sx, sy, ex, ey) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_moveLineEndpoint(retptr, this.__wbg_ptr, sec, para, ci, sx, sy, ex, ey);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * HTML 문자열을 파싱하여 셀 내부 캐럿 위치에 삽입한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {string} html
    * @returns {string}
    */
    pasteHtmlInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, html) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(html, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_pasteHtmlInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 특정 페이지를 Canvas 명령 수로 반환한다.
    * @param {number} page_num
    * @returns {number}
    */
    renderPageCanvas(page_num) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_renderPageCanvas(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 여러 셀의 width/height를 한 번에 조절한다 (배치).
    *
    * json: `[{"cellIdx":0,"widthDelta":150},{"cellIdx":2,"heightDelta":-100}]`
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {string} json
    * @returns {string}
    */
    resizeTableCells(section_idx, parent_para_idx, control_idx, json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_resizeTableCells(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 미주 모양을 적용한다.
    * @param {number} section_idx
    * @param {string} props_json
    * @returns {string}
    */
    applyEndnoteShape(section_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyEndnoteShape(retptr, this.__wbg_ptr, section_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 배포용(읽기전용) 문서를 편집 가능한 일반 문서로 변환한다.
    *
    * 반환값: JSON `{"ok":true,"converted":true}` 또는 `{"ok":true,"converted":false}`
    * @returns {string}
    */
    convertToEditable() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_convertToEditable(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표에서 열을 삭제한다.
    *
    * 반환값: JSON `{"ok":true,"rowCount":<N>,"colCount":<M>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} col_idx
    * @returns {string}
    */
    deleteTableColumn(section_idx, parent_para_idx, control_idx, col_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteTableColumn(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, col_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 셀 내부 문단에서 텍스트를 삭제한다.
    *
    * 반환값: JSON `{"ok":true,"charOffset":<offset_after_delete>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    deleteTextInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteTextInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 컨트롤 객체를 HTML 문자열로 변환한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {string} cell_path_json
    * @param {number} control_idx
    * @returns {string}
    */
    exportControlHtml(section_idx, para_idx, cell_path_json, control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_exportControlHtml(retptr, this.__wbg_ptr, section_idx, para_idx, ptr0, len0, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 셀 속성을 조회한다.
    *
    * 반환: JSON `{width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, verticalAlign, textDirection, isHeader}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @returns {string}
    */
    getCellProperties(section_idx, parent_para_idx, control_idx, cell_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 페이지 레이어 트리를 JSON 문자열로 반환한다.
    * @param {number} page_num
    * @returns {string}
    */
    getPageLayerTree(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageLayerTree(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 구역 내 문단 수를 반환한다.
    * @param {number} section_idx
    * @returns {number}
    */
    getParagraphCount(section_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getParagraphCount(retptr, this.__wbg_ptr, section_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 본문 선택 영역의 줄별 사각형을 반환한다.
    *
    * 반환: JSON 배열 `[{"pageIndex":N,"x":F,"y":F,"width":F,"height":F}, ...]`
    * @param {number} section_idx
    * @param {number} start_para_idx
    * @param {number} start_char_offset
    * @param {number} end_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    getSelectionRects(section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getSelectionRects(retptr, this.__wbg_ptr, section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 단 나누기 삽입 (Ctrl+Shift+Enter)
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    insertColumnBreak(section_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertColumnBreak(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표에 열을 삽입한다.
    *
    * 반환값: JSON `{"ok":true,"rowCount":<N>,"colCount":<M>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} col_idx
    * @param {boolean} right
    * @returns {string}
    */
    insertTableColumn(section_idx, parent_para_idx, control_idx, col_idx, right) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_insertTableColumn(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, col_idx, right);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 셀 내부 문단에 텍스트를 삽입한다.
    *
    * 반환값: JSON `{"ok":true,"charOffset":<new_offset>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {string} text
    * @returns {string}
    */
    insertTextInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, text) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertTextInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 논리적 오프셋으로 텍스트를 삽입한다.
    *
    * logical_offset: 텍스트 문자 + 인라인 컨트롤을 각각 1로 세는 위치.
    * 예: "abc[표]XYZ" → a(0) b(1) c(2) [표](3) X(4) Y(5) Z(6)
    * logical_offset=4이면 표 뒤의 X 앞에 삽입.
    * 반환값: JSON `{"ok":true,"logicalOffset":<new_logical_offset>}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} logical_offset
    * @param {string} text
    * @returns {string}
    */
    insertTextLogical(section_idx, para_idx, logical_offset, text) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertTextLogical(retptr, this.__wbg_ptr, section_idx, para_idx, logical_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 커서 위치의 누름틀 필드를 제거한다 (본문 문단).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    removeFieldAt(section_idx, para_idx, char_offset) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_removeFieldAt(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 셀 속성을 수정한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {string} json
    * @returns {string}
    */
    setCellProperties(section_idx, parent_para_idx, control_idx, cell_idx, json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setCellProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 모든 구역의 SectionDef를 일괄 변경하고 재페이지네이션한다.
    * @param {string} json
    * @returns {string}
    */
    setSectionDefAll(json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setSectionDefAll(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 스타일의 CharShape/ParaShape를 수정한다.
    *
    * charMods/paraMods는 기존 parse_char_shape_mods/parse_para_shape_mods와 동일한 JSON 형식
    * @param {number} style_id
    * @param {string} char_mods_json
    * @param {string} para_mods_json
    * @returns {boolean}
    */
    updateStyleShapes(style_id, char_mods_json, para_mods_json) {
        const ptr0 = passStringToWasm0(char_mods_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(para_mods_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_updateStyleShapes(this.__wbg_ptr, style_id, ptr0, len0, ptr1, len1);
        return ret !== 0;
    }
    /**
    * Shape z-order 변경
    * operation: "front" | "back" | "forward" | "backward"
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {string} operation
    * @returns {string}
    */
    changeShapeZOrder(section_idx, parent_para_idx, control_idx, operation) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(operation, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_changeShapeZOrder(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 생성 (빈 문단 1개 포함)
    *
    * 반환: JSON `{"ok":true,"kind":"header/footer","applyTo":N,...}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @returns {string}
    */
    createHeaderFooter(section_idx, is_header, apply_to) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_createHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 커서 위치에 글상자(Rectangle + TextBox)를 삽입한다.
    *
    * json: `{"sectionIdx":N,"paraIdx":N,"charOffset":N,"width":N,"height":N,
    *         "horzOffset":N,"vertOffset":N,"treatAsChar":bool,"textWrap":"Square"}`
    * 반환: JSON `{"ok":true,"paraIdx":<N>,"controlIdx":0}`
    * @param {string} json
    * @returns {string}
    */
    createShapeControl(json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_createShapeControl(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 머리말/꼬리말을 삭제한다 (컨트롤 자체 제거).
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @returns {string}
    */
    deleteHeaderFooter(section_idx, is_header, apply_to) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀 내 선택 영역을 삭제한다.
    *
    * 반환: JSON `{"ok":true,"paraIdx":N,"charOffset":N}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} start_cell_para_idx
    * @param {number} start_char_offset
    * @param {number} end_cell_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    deleteRangeInCell(section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteRangeInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Shape(글상자) 컨트롤을 문단에서 삭제한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    deleteShapeControl(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteShapeControl(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 컨트롤을 문단에서 삭제한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    deleteTableControl(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteTableControl(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 누름틀 필드의 속성을 조회한다.
    *
    * 반환: JSON `{"ok":true,"guide":"안내문","memo":"메모","name":"이름","editable":true}`
    * @param {number} field_id
    * @returns {string}
    */
    getClickHereProps(field_id) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getClickHereProps(retptr, this.__wbg_ptr, field_id);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 양식 개체 상세 정보를 반환한다 (properties 포함).
    *
    * 반환: `{ok, formType, name, value, text, caption, enabled, width, height, foreColor, backColor, properties}`
    * @param {number} sec
    * @param {number} para
    * @param {number} ci
    * @returns {string}
    */
    getFormObjectInfo(sec, para, ci) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFormObjectInfo(retptr, this.__wbg_ptr, sec, para, ci);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 구역의 쪽 테두리/배경 설정을 JSON으로 반환한다.
    * @param {number} section_idx
    * @returns {string}
    */
    getPageBorderFill(section_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageBorderFill(retptr, this.__wbg_ptr, section_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 위치에 해당하는 글로벌 쪽 번호 반환
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {string}
    */
    getPageOfPosition(section_idx, para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageOfPosition(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 페이지 렌더 트리를 JSON 문자열로 반환한다.
    * @param {number} page_num
    * @returns {string}
    */
    getPageRenderTree(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageRenderTree(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 특정 페이지의 텍스트 레이아웃 정보를 JSON 문자열로 반환한다.
    *
    * 각 TextRun의 위치, 텍스트, 글자별 X 좌표 경계값을 포함한다.
    * @param {number} page_num
    * @returns {string}
    */
    getPageTextLayout(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageTextLayout(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문단의 글자 수(char 개수)를 반환한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {number}
    */
    getParagraphLength(section_idx, para_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getParagraphLength(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 글로벌 쪽 번호에 해당하는 첫 문단 위치 반환
    * @param {number} global_page
    * @returns {string}
    */
    getPositionOfPage(global_page) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPositionOfPage(retptr, this.__wbg_ptr, global_page);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Shape(글상자) 속성을 조회한다.
    *
    * 반환: JSON `{ width, height, treatAsChar, tbMarginLeft, ... }`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getShapeProperties(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getShapeProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표의 행/열/셀 수를 반환한다.
    *
    * 반환: JSON `{"rowCount":N,"colCount":N,"cellCount":N}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getTableDimensions(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getTableDimensions(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 속성을 조회한다.
    *
    * 반환: JSON `{cellSpacing, paddingLeft, paddingRight, paddingTop, paddingBottom, pageBreak, repeatHeader}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getTableProperties(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getTableProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 각주 내부 텍스트 히트테스트
    * @param {number} page_num
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    hitTestInFootnote(page_num, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_hitTestInFootnote(retptr, this.__wbg_ptr, page_num, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 활성 필드를 설정한다 (본문 문단 — 안내문 숨김용).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {boolean}
    */
    setActiveField(section_idx, para_idx, char_offset) {
        const ret = wasm.hwpdocument_setActiveField(this.__wbg_ptr, section_idx, para_idx, char_offset);
        return ret !== 0;
    }
    /**
    * 구역의 쪽 테두리/배경 설정을 변경하고 재페이지네이션한다.
    * @param {number} section_idx
    * @param {string} json
    * @returns {string}
    */
    setPageBorderFill(section_idx, json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setPageBorderFill(retptr, this.__wbg_ptr, section_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * Shape(글상자) 속성을 변경한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {string} props_json
    * @returns {string}
    */
    setShapeProperties(section_idx, parent_para_idx, control_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setShapeProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 표 속성을 수정한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {string} json
    * @returns {string}
    */
    setTableProperties(section_idx, parent_para_idx, control_idx, json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setTableProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 내부 클립보드에 컨트롤(표/그림/도형)이 포함되어 있는지 확인한다.
    * @returns {boolean}
    */
    clipboardHasControl() {
        const ret = wasm.hwpdocument_clipboardHasControl(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * 내장 템플릿에서 빈 문서를 생성한다.
    *
    * saved/blank2010.hwp를 WASM 바이너리에 포함하여 유효한 HWP 문서를 즉시 생성.
    * DocInfo raw_stream이 온전하므로 FIX-4 워크어라운드와 호환됨.
    * @returns {string}
    */
    createBlankDocument() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_createBlankDocument(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 특정 문자의 글머리표 정의가 없으면 생성한다.
    *
    * 반환값: Bullet ID (1-based)
    * @param {string} bullet_char_str
    * @returns {number}
    */
    ensureDefaultBullet(bullet_char_str) {
        const ptr0 = passStringToWasm0(bullet_char_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_ensureDefaultBullet(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
    * 선택 영역을 HTML 문자열로 변환한다 (본문).
    * @param {number} section_idx
    * @param {number} start_para_idx
    * @param {number} start_char_offset
    * @param {number} end_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    exportSelectionHtml(section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_exportSelectionHtml(retptr, this.__wbg_ptr, section_idx, start_para_idx, start_char_offset, end_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 경로 기반 셀 정보 조회 (중첩 표용).
    *
    * 반환: JSON `{"row":N,"col":N,"rowSpan":N,"colSpan":N}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @returns {string}
    */
    getCellInfoByPath(section_idx, parent_para_idx, path_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCellInfoByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 커서 위치의 필드 범위 정보를 조회한다 (본문 문단).
    *
    * 반환: `{inField, fieldId?, startCharIdx?, endCharIdx?, isGuide?, guideName?}`
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getFieldInfoAt(section_idx, para_idx, char_offset) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFieldInfoAt(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 표 셀 내 문단의 줄 정보를 반환한다.
    *
    * 반환: JSON `{"lineIndex":N,"lineCount":N,"charStart":N,"charEnd":N}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getLineInfoInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getLineInfoInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표의 모든 셀 bbox를 반환한다 (F5 셀 선택 모드용).
    *
    * 반환: JSON `[{cellIdx, row, col, rowSpan, colSpan, pageIndex, x, y, w, h}, ...]`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number | undefined} [page_hint]
    * @returns {string}
    */
    getTableCellBboxes(section_idx, parent_para_idx, control_idx, page_hint) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getTableCellBboxes(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, !isLikeNone(page_hint), isLikeNone(page_hint) ? 0 : page_hint);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * [Task #741 후속] 외부 file path 그림 영역 영역 binary data 영역 inject.
    *
    * JS 영역 영역 영역 fetch 영역 영역 영역 file 영역 load 영역 후 본 메서드 영역 호출 영역
    * IR 영역 영역 영역 image binary 영역 영역 → renderer 영역 영역 표시.
    *
    * `basename`: 영역 영역 file 영역 영역 (예: "oracle.gif")
    * `data`: 영역 영역 binary 영역
    * `display_path`: dialog 영역 영역 영역 영역 표시 영역 영역 path. 빈 문자열 ("") 영역
    *                 영역 영역 fallback 영역 영역 `/samples/<basename>` 영역 사용. 한컴 viewer
    *                 정합 영역 영역 OS 영역 절대 경로 영역 영역 (예: "/Users/.../samples/rdb02.gif")
    * @param {string} basename
    * @param {Uint8Array} data
    * @param {string} display_path
    * @returns {number}
    */
    injectExternalImage(basename, data, display_path) {
        const ptr0 = passStringToWasm0(basename, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(display_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_injectExternalImage(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret >>> 0;
    }
    /**
    * 경로 기반 수직 커서 이동 (중첩 표용).
    *
    * 반환: JSON `{DocumentPosition + CursorRect + preferredX}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @param {number} delta
    * @param {number} preferred_x
    * @returns {string}
    */
    moveVerticalByPath(section_idx, parent_para_idx, path_json, char_offset, delta, preferred_x) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_moveVerticalByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset, delta, preferred_x);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 특정 페이지를 Canvas 2D에 직접 렌더링한다.
    *
    * WASM 환경에서만 사용 가능하다. Canvas 크기는 페이지 크기 × scale로 설정된다.
    * scale이 0 이하이면 1.0으로 처리한다 (하위호환).
    * @param {number} page_num
    * @param {HTMLCanvasElement} canvas
    * @param {number} scale
    */
    renderPageToCanvas(page_num, canvas, scale) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_renderPageToCanvas(retptr, this.__wbg_ptr, page_num, addBorrowedObject(canvas), scale);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * 문단 서식을 적용한다 (본문 문단).
    * 문단 번호 시작 방식 설정
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} mode
    * @param {number} start_num
    * @returns {string}
    */
    setNumberingRestart(section_idx, para_idx, mode, start_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_setNumberingRestart(retptr, this.__wbg_ptr, section_idx, para_idx, mode, start_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀을 N줄 × M칸으로 분할한다.
    *
    * 반환값: JSON `{"ok":true,"cellCount":<N>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} row
    * @param {number} col
    * @param {number} n_rows
    * @param {number} m_cols
    * @param {boolean} equal_row_height
    * @param {boolean} merge_first
    * @returns {string}
    */
    splitTableCellInto(section_idx, parent_para_idx, control_idx, row, col, n_rows, m_cols, equal_row_height, merge_first) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitTableCellInto(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, row, col, n_rows, m_cols, equal_row_height, merge_first);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 활성 필드를 해제한다 (안내문 다시 표시).
    */
    clearActiveField() {
        wasm.hwpdocument_clearActiveField(this.__wbg_ptr);
    }
    /**
    * 표 셀 내부 선택 영역을 내부 클립보드에 복사한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} start_cell_para_idx
    * @param {number} start_char_offset
    * @param {number} end_cell_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    copySelectionInCell(section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_copySelectionInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 그림 컨트롤을 문단에서 삭제한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    deletePictureControl(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deletePictureControl(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 셀에서 계산식을 실행한다.
    *
    * formula: "=SUM(A1:A5)", "=A1+B2*3" 등
    * write_result: true이면 결과를 셀에 기록
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} target_row
    * @param {number} target_col
    * @param {string} formula
    * @param {boolean} write_result
    * @returns {string}
    */
    evaluateTableFormula(section_idx, parent_para_idx, control_idx, target_row, target_col, formula, write_result) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_evaluateTableFormula(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, target_row, target_col, ptr0, len0, write_result);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 글꼴 이름으로 font_id를 조회하거나 새로 생성한다.
    *
    * 한글(0번) 카테고리에서 이름 검색 → 없으면 7개 전체 카테고리에 신규 등록.
    * 반환값: font_id (u16), 실패 시 -1
    * @param {string} name
    * @returns {number}
    */
    findOrCreateFontId(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_findOrCreateFontId(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
    * 캐럿 위치의 글자 속성을 조회한다.
    *
    * 반환값: JSON 객체 (fontFamily, fontSize, bold, italic, underline, strikethrough, textColor 등)
    * @param {number} sec_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getCharPropertiesAt(sec_idx, para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCharPropertiesAt(retptr, this.__wbg_ptr, sec_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 컨트롤의 이미지 바이너리 데이터를 반환한다 (Uint8Array).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {string} cell_path_json
    * @param {number} control_idx
    * @returns {Uint8Array}
    */
    getControlImageData(section_idx, para_idx, cell_path_json, control_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getControlImageData(retptr, this.__wbg_ptr, section_idx, para_idx, ptr0, len0, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 컨트롤의 이미지 MIME 타입을 반환한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {string} cell_path_json
    * @param {number} control_idx
    * @returns {string}
    */
    getControlImageMime(section_idx, para_idx, cell_path_json, control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getControlImageMime(retptr, this.__wbg_ptr, section_idx, para_idx, ptr0, len0, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 본문 커서 위치의 각주 마커를 조회한다.
    *
    * direction: "backward" 또는 "forward"
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @param {string} direction
    * @returns {string}
    */
    getFootnoteAtCursor(section_idx, para_idx, char_offset, direction) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(direction, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getFootnoteAtCursor(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 문서 전체의 머리말/꼬리말 목록을 반환한다.
    * @param {number} current_section_idx
    * @param {boolean} current_is_header
    * @param {number} current_apply_to
    * @returns {string}
    */
    getHeaderFooterList(current_section_idx, current_is_header, current_apply_to) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getHeaderFooterList(retptr, this.__wbg_ptr, current_section_idx, current_is_header, current_apply_to);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 페이지의 각주 참조 정보
    * @param {number} page_num
    * @param {number} footnote_index
    * @returns {string}
    */
    getPageFootnoteInfo(page_num, footnote_index) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageFootnoteInfo(retptr, this.__wbg_ptr, page_num, footnote_index);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 캐럿 위치의 문단 속성을 조회한다.
    *
    * 반환값: JSON 객체 (alignment, lineSpacing, marginLeft, marginRight, indent 등)
    * @param {number} sec_idx
    * @param {number} para_idx
    * @returns {string}
    */
    getParaPropertiesAt(sec_idx, para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getParaPropertiesAt(retptr, this.__wbg_ptr, sec_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 그림 컨트롤의 속성을 조회한다.
    *
    * 반환: JSON `{ width, height, treatAsChar, ... }`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    getPictureProperties(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPictureProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 조판부호 표시 여부를 반환한다.
    * @returns {boolean}
    */
    getShowControlCodes() {
        const ret = wasm.hwpdocument_getShowControlCodes(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * 내부 클립보드에 데이터가 있는지 확인한다.
    * @returns {boolean}
    */
    hasInternalClipboard() {
        const ret = wasm.hwpdocument_hasInternalClipboard(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * 페이지 좌표가 머리말/꼬리말 영역에 해당하는지 판별한다.
    *
    * 반환: JSON `{"hit":true/false,"isHeader":bool,"sectionIndex":N,"applyTo":N}`
    * @param {number} page_num
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    hitTestHeaderFooter(page_num, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_hitTestHeaderFooter(retptr, this.__wbg_ptr, page_num, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 논리적 오프셋 → 텍스트 오프셋 변환.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} logical_offset
    * @returns {number}
    */
    logicalToTextOffset(section_idx, para_idx, logical_offset) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_logicalToTextOffset(retptr, this.__wbg_ptr, section_idx, para_idx, logical_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 내부 클립보드의 내용을 표 셀 내부에 붙여넣는다.
    *
    * 반환값: JSON `{"ok":true,"cellParaIdx":<idx>,"charOffset":<offset>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    pasteInternalInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_pasteInternalInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀 내부 양식 개체 값을 설정한다.
    *
    * table_para: 표를 포함한 최상위 문단 인덱스
    * table_ci: 표 컨트롤 인덱스
    * cell_idx: 셀 인덱스
    * cell_para: 셀 내 문단 인덱스
    * form_ci: 셀 내 양식 컨트롤 인덱스
    * value_json: `{"value":1}` 또는 `{"text":"입력값"}`
    * 반환: `{ok}`
    * @param {number} sec
    * @param {number} table_para
    * @param {number} table_ci
    * @param {number} cell_idx
    * @param {number} cell_para
    * @param {number} form_ci
    * @param {string} value_json
    * @returns {string}
    */
    setFormValueInCell(sec, table_para, table_ci, cell_idx, cell_para, form_ci, value_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(value_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setFormValueInCell(retptr, this.__wbg_ptr, sec, table_para, table_ci, cell_idx, cell_para, form_ci, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 그림 컨트롤의 속성을 변경한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {string} props_json
    * @returns {string}
    */
    setPictureProperties(section_idx, parent_para_idx, control_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setPictureProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * LINE_SEG vpos-reset 강제 분리 적용 여부를 설정한다.
    * 변경 시 페이지네이션 결과가 달라지므로 모든 섹션을 재페이지네이션한다.
    * @param {boolean} enabled
    */
    set_respect_vpos_reset(enabled) {
        wasm.hwpdocument_set_respect_vpos_reset(this.__wbg_ptr, enabled);
    }
    /**
    * 조판부호 표시 여부를 설정한다 (개체 마커 + 문단부호 포함).
    * @param {boolean} enabled
    */
    setShowControlCodes(enabled) {
        wasm.hwpdocument_setShowControlCodes(this.__wbg_ptr, enabled);
    }
    /**
    * 텍스트 오프셋 → 논리적 오프셋 변환.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} text_offset
    * @returns {number}
    */
    textToLogicalOffset(section_idx, para_idx, text_offset) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_textToLogicalOffset(retptr, this.__wbg_ptr, section_idx, para_idx, text_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 머리말/꼬리말 문단에 문단 서식을 적용한다.
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @param {string} props_json
    * @returns {string}
    */
    applyParaFormatInHf(section_idx, is_header, apply_to, hf_para_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyParaFormatInHf(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 수식 컨트롤을 문단에서 삭제한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @returns {string}
    */
    deleteEquationControl(section_idx, parent_para_idx, control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteEquationControl(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 각주 내 텍스트를 삭제한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} fn_para_idx
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    deleteTextInFootnote(section_idx, para_idx, control_idx, fn_para_idx, char_offset, count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteTextInFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, fn_para_idx, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 표 셀의 텍스트 방향을 반환한다 (0=가로, 1=세로/영문눕힘, 2=세로/영문세움).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @returns {number}
    */
    getCellTextDirection(section_idx, parent_para_idx, control_idx, cell_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellTextDirection(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 경로 기반 커서 좌표 조회 (중첩 표용).
    *
    * path_json: `[{"controlIndex":N,"cellIndex":N,"cellParaIndex":N}, ...]`
    * 반환: JSON `{"pageIndex":N,"x":F,"y":F,"height":F}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @returns {string}
    */
    getCursorRectByPath(section_idx, parent_para_idx, path_json, char_offset) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCursorRectByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 표 셀 내부 커서 위치의 픽셀 좌표를 반환한다.
    *
    * 반환: JSON `{"pageIndex":N,"x":F,"y":F,"height":F}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getCursorRectInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCursorRectInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 각주/미주 내부 커서 렉트 계산
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} note_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getCursorRectInNote(section_idx, para_idx, control_idx, note_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCursorRectInNote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, note_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 수식 컨트롤의 속성을 조회한다.
    *
    * 반환: JSON `{ script, fontSize, color, baseline, fontName }`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @returns {string}
    */
    getEquationProperties(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getEquationProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 컨트롤(표, 이미지 등) 레이아웃 정보를 반환한다.
    * @param {number} page_num
    * @returns {string}
    */
    getPageControlLayout(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageControlLayout(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 페이지 overlay 이미지 정보만 JSON 문자열로 반환한다.
    * @param {number} page_num
    * @returns {string}
    */
    getPageOverlayImages(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getPageOverlayImages(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * HWPX 비표준 감지 경고를 JSON 문자열로 반환한다 (#177).
    *
    * ## 반환 형식
    *
    * ```json
    * {
    *   "count": 3,
    *   "summary": {
    *     "lineseg 배열이 비어있음": 1,
    *     "lineseg 가 미계산 상태 (line_height=0)": 2
    *   },
    *   "warnings": [
    *     {
    *       "section": 0,
    *       "paragraph": 5,
    *       "kind": "LinesegArrayEmpty",
    *       "cell": null
    *     },
    *     {
    *       "section": 0,
    *       "paragraph": 10,
    *       "kind": "LinesegUncomputed",
    *       "cell": {"ctrl": 0, "row": 0, "col": 1, "innerPara": 0}
    *     }
    *   ]
    * }
    * ```
    * @returns {string}
    */
    getValidationWarnings() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getValidationWarnings(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 각주 내 텍스트를 삽입한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} fn_para_idx
    * @param {number} char_offset
    * @param {string} text
    * @returns {string}
    */
    insertTextInFootnote(section_idx, para_idx, control_idx, fn_para_idx, char_offset, text) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertTextInFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, fn_para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 셀 내부 문단을 이전 문단에 병합한다 (셀 내 Backspace at start).
    *
    * 반환값: JSON `{"ok":true,"cellParaIndex":<prev_idx>,"charOffset":<merge_point>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @returns {string}
    */
    mergeParagraphInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_mergeParagraphInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 수식 스크립트를 SVG로 렌더링하여 반환한다 (미리보기 전용).
    *
    * 반환: 완전한 `<svg>` 문자열
    * @param {string} script
    * @param {number} font_size_hwpunit
    * @param {number} color
    * @returns {string}
    */
    renderEquationPreview(script, font_size_hwpunit, color) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(script, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_renderEquationPreview(retptr, this.__wbg_ptr, ptr0, len0, font_size_hwpunit, color);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 수식 컨트롤의 속성을 변경한다.
    *
    * 반환: JSON `{"ok":true}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {string} props_json
    * @returns {string}
    */
    setEquationProperties(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setEquationProperties(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 셀 내부 문단을 분할한다 (셀 내 Enter 키).
    *
    * 반환값: JSON `{"ok":true,"cellParaIndex":<new_idx>,"charOffset":0}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    splitParagraphInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitParagraphInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 누름틀 필드의 속성을 수정한다.
    *
    * 반환: JSON `{"ok":true}` 또는 `{"ok":false}`
    * @param {number} field_id
    * @param {string} guide
    * @param {string} memo
    * @param {string} name
    * @param {boolean} editable
    * @returns {string}
    */
    updateClickHereProps(field_id, guide, memo, name, editable) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(guide, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(memo, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            wasm.hwpdocument_updateClickHereProps(retptr, this.__wbg_ptr, field_id, ptr0, len0, ptr1, len1, ptr2, len2, editable);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred4_0 = r0;
            deferred4_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 문서에 기본 문단 번호 정의가 없으면 생성한다.
    *
    * 반환값: Numbering ID (1-based)
    * @returns {number}
    */
    ensureDefaultNumbering() {
        const ret = wasm.hwpdocument_ensureDefaultNumbering(this.__wbg_ptr);
        return ret;
    }
    /**
    * 표 셀 내 문단 수를 반환한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @returns {number}
    */
    getCellParagraphCount(section_idx, parent_para_idx, control_idx, cell_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellParagraphCount(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 문단별 줄 폭 측정 진단 (WASM)
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {string}
    */
    measureWidthDiagnostic(section_idx, para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_measureWidthDiagnostic(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문단부호(¶) 표시 여부를 설정한다.
    * @param {boolean} enabled
    */
    setShowParagraphMarks(enabled) {
        wasm.hwpdocument_setShowParagraphMarks(this.__wbg_ptr, enabled);
    }
    /**
    * 글자 서식을 적용한다 (셀 내 문단).
    * @param {number} sec_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} start_offset
    * @param {number} end_offset
    * @param {string} props_json
    * @returns {string}
    */
    applyCharFormatInCell(sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, start_offset, end_offset, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyCharFormatInCell(retptr, this.__wbg_ptr, sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, start_offset, end_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 문단 서식을 적용한다 (셀 내 문단).
    * @param {number} sec_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {string} props_json
    * @returns {string}
    */
    applyParaFormatInCell(sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyParaFormatInCell(retptr, this.__wbg_ptr, sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * CanvasKit direct replay 정책 진단을 JSON 문자열로 반환한다.
    *
    * `mode` 는 `"default"` 또는 `"compat"` 를 받는다. 빈 문자열은 `"default"` 로 처리한다.
    * 현재 두 mode 모두 hidden Canvas2D overlay 없이 direct replay required 정책을 따른다.
    * `compat` 는 API/URL 호환성과 이후 보수적인 direct replay 튜닝을 위해 남겨 둔 선택지다.
    * @param {number} page_num
    * @param {string} mode
    * @returns {string}
    */
    getCanvasKitReplayPlan(page_num, mode) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCanvasKitReplayPlan(retptr, this.__wbg_ptr, page_num, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 표 셀 내 문단의 글자 수를 반환한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @returns {number}
    */
    getCellParagraphLength(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellParagraphLength(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 머리말/꼬리말 문단의 문단 속성을 조회한다.
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @returns {string}
    */
    getParaPropertiesInHf(section_idx, is_header, apply_to, hf_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getParaPropertiesInHf(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문단에 텍스트박스가 있는 Shape 컨트롤이 있으면 해당 control_index를 반환한다.
    * 없으면 -1을 반환한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {number}
    */
    getTextBoxControlIndex(section_idx, para_idx) {
        const ret = wasm.hwpdocument_getTextBoxControlIndex(this.__wbg_ptr, section_idx, para_idx);
        return ret;
    }
    /**
    * 머리말/꼬리말 내부 텍스트 히트테스트.
    *
    * 편집 모드에서 클릭한 좌표의 문단·문자 위치를 반환.
    * 반환: JSON `{"hit":true,"paraIndex":N,"charOffset":N,"cursorRect":{...}}`
    * @param {number} page_num
    * @param {boolean} is_header
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    hitTestInHeaderFooter(page_num, is_header, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_hitTestInHeaderFooter(retptr, this.__wbg_ptr, page_num, is_header, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {number} page_num
    * @returns {number}
    */
    renderPageCanvasLegacy(page_num) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_renderPageCanvasLegacy(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 머리말/꼬리말 감추기를 토글한다 (현재 쪽만).
    *
    * 반환: JSON `{"hidden":true/false}` — 토글 후 상태
    * @param {number} page_index
    * @param {boolean} is_header
    * @returns {string}
    */
    toggleHideHeaderFooter(page_index, is_header) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_toggleHideHeaderFooter(retptr, this.__wbg_ptr, page_index, is_header);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서 트리에서 다음 편집 가능한 컨트롤/본문을 찾는다.
    * delta=+1(앞), delta=-1(뒤). ctrl_idx=-1이면 본문 텍스트에서 출발.
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} ctrl_idx
    * @param {number} delta
    * @returns {string}
    */
    findNextEditableControl(section_idx, para_idx, ctrl_idx, delta) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_findNextEditableControl(retptr, this.__wbg_ptr, section_idx, para_idx, ctrl_idx, delta);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 문단 내 컨트롤의 텍스트 위치 배열을 반환한다.
    * @param {number} section_idx
    * @param {number} para_idx
    * @returns {string}
    */
    getControlTextPositions(section_idx, para_idx) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getControlTextPositions(retptr, this.__wbg_ptr, section_idx, para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * HTML 문자열을 파싱하여 cellPath가 가리키는 중첩 표 셀에 삽입한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @param {string} html
    * @returns {string}
    */
    pasteHtmlInCellByPath(section_idx, parent_para_idx, path_json, char_offset, html) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(html, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_pasteHtmlInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 범위 내 셀들을 각각 N줄 × M칸으로 분할한다.
    *
    * 반환값: JSON `{"ok":true,"cellCount":<N>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} start_row
    * @param {number} start_col
    * @param {number} end_row
    * @param {number} end_col
    * @param {number} n_rows
    * @param {number} m_cols
    * @param {boolean} equal_row_height
    * @returns {string}
    */
    splitTableCellsInRange(section_idx, parent_para_idx, control_idx, start_row, start_col, end_row, end_col, n_rows, m_cols, equal_row_height) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitTableCellsInRange(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, start_row, start_col, end_row, end_col, n_rows, m_cols, equal_row_height);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀 내부 문단의 글자 속성을 조회한다.
    * @param {number} sec_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getCellCharPropertiesAt(sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellCharPropertiesAt(retptr, this.__wbg_ptr, sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀 내부 문단의 문단 속성을 조회한다.
    * @param {number} sec_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @returns {string}
    */
    getCellParaPropertiesAt(sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCellParaPropertiesAt(retptr, this.__wbg_ptr, sec_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 각주 내 커서 렉트 계산
    * @param {number} page_num
    * @param {number} footnote_index
    * @param {number} fn_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    getCursorRectInFootnote(page_num, footnote_index, fn_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCursorRectInFootnote(retptr, this.__wbg_ptr, page_num, footnote_index, fn_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 필드 이름으로 값을 조회한다.
    *
    * 반환: `{ok, fieldId, value}`
    * @param {string} name
    * @returns {string}
    */
    getFieldValueByName(name) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getFieldValueByName(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 문단 정보 조회
    *
    * 반환: JSON `{"ok":true,"paraCount":N,"charCount":N}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @returns {string}
    */
    getHeaderFooterParaInfo(section_idx, is_header, apply_to, hf_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getHeaderFooterParaInfo(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 셀 내 선택 영역의 줄별 사각형을 반환한다.
    *
    * 반환: JSON 배열 `[{"pageIndex":N,"x":F,"y":F,"width":F,"height":F}, ...]`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} start_cell_para_idx
    * @param {number} start_char_offset
    * @param {number} end_cell_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    getSelectionRectsInCell(section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getSelectionRectsInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 각주 내 문단을 병합한다 (Backspace at start).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} fn_para_idx
    * @returns {string}
    */
    mergeParagraphInFootnote(section_idx, para_idx, control_idx, fn_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_mergeParagraphInFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, fn_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 문서 트리 DFS 기반 다음/이전 편집 가능 위치를 반환한다.
    * context_json: NavContextEntry 배열의 JSON (빈 배열 "[]" = body)
    * @param {number} sec
    * @param {number} para
    * @param {number} char_offset
    * @param {number} delta
    * @param {string} context_json
    * @returns {string}
    */
    navigateNextEditable(sec, para, char_offset, delta, context_json) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(context_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_navigateNextEditable(retptr, this.__wbg_ptr, sec, para, char_offset, delta, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 커서 위치의 누름틀 필드를 제거한다 (셀/글상자 내 문단).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {boolean} is_textbox
    * @returns {string}
    */
    removeFieldAtInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, is_textbox) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_removeFieldAtInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, is_textbox);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 필드 이름으로 값을 설정한다.
    *
    * 반환: `{ok, fieldId, oldValue, newValue}`
    * @param {string} name
    * @param {string} value
    * @returns {string}
    */
    setFieldValueByName(name, value) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setFieldValueByName(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 각주 내 문단을 분할한다 (Enter).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} fn_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    splitParagraphInFootnote(section_idx, para_idx, control_idx, fn_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitParagraphInFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, fn_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 내 텍스트 삭제
    *
    * 반환: JSON `{"ok":true,"charOffset":<offset>}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    deleteTextInHeaderFooter(section_idx, is_header, apply_to, hf_para_idx, char_offset, count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_deleteTextInHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 현재 위치 이후의 가장 가까운 선택 가능 컨트롤을 찾는다 (Shift+F11).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    findNearestControlForward(section_idx, para_idx, char_offset) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_findNearestControlForward(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * [Task #741 후속] 외부 file path 그림 영역 영역 영역 영역 basename 목록 영역 반환.
    *
    * HWP3 파일 영역 image 영역 영역 절대 경로 영역 저장 영역. WASM 환경 영역 영역 file
    * system access 부재 영역, JS 영역 영역 영역 영역 fetch 영역 영역 영역 file 영역 load
    * 영역 후 `injectExternalImage` 영역 영역 영역 inject 영역.
    *
    * 반환: JSON 배열 `["oracle.gif", "rdb02.gif", ...]` (중복 제거)
    * @returns {string}
    */
    getExternalImageBasenames() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getExternalImageBasenames(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 각주/미주 내부 수식 컨트롤의 속성을 조회한다.
    * @param {string} kind
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} note_control_idx
    * @param {number} note_para_idx
    * @param {number} inner_control_idx
    * @returns {string}
    */
    getNoteEquationProperties(kind, section_idx, parent_para_idx, note_control_idx, note_para_idx, inner_control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(kind, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getNoteEquationProperties(retptr, this.__wbg_ptr, ptr0, len0, section_idx, parent_para_idx, note_control_idx, note_para_idx, inner_control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 투명선 표시 여부를 반환한다.
    * @returns {boolean}
    */
    getShowTransparentBorders() {
        const ret = wasm.hwpdocument_getShowTransparentBorders(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * 경로 기반 표 차원 조회 (중첩 표용).
    *
    * 반환: JSON `{"rowCount":N,"colCount":N,"cellCount":N}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @returns {string}
    */
    getTableDimensionsByPath(section_idx, parent_para_idx, path_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getTableDimensionsByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    getTextInCellByPath(section_idx, parent_para_idx, path_json, char_offset, count) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getTextInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * [Task #1143] `getExternalImageReferences()` 의 key로 외부 이미지 bytes를 주입한다.
    *
    * 지원 key: `binData:<bin_data_id>`.
    * 잘못된 key, 존재하지 않는 key, 이미 loaded 상태인 reference는 0을 반환한다.
    * @param {string} key
    * @param {Uint8Array} data
    * @param {string} display_path
    * @returns {number}
    */
    injectExternalImageByKey(key, data, display_path) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(display_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_injectExternalImageByKey(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret >>> 0;
    }
    /**
    * 머리말/꼬리말 내 텍스트 삽입
    *
    * 반환: JSON `{"ok":true,"charOffset":<new_offset>}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @param {number} char_offset
    * @param {string} text
    * @returns {string}
    */
    insertTextInHeaderFooter(section_idx, is_header, apply_to, hf_para_idx, char_offset, text) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertTextInHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx, char_offset, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 특정 페이지를 기존 PageRenderTree 경로로 Canvas 2D에 직접 렌더링한다.
    * @param {number} page_num
    * @param {HTMLCanvasElement} canvas
    * @param {number} scale
    */
    renderPageToCanvasLegacy(page_num, canvas, scale) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_renderPageToCanvasLegacy(retptr, this.__wbg_ptr, page_num, addBorrowedObject(canvas), scale);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * path 기반: 중첩 표 셀 내 활성 필드를 설정한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @returns {boolean}
    */
    setActiveFieldByPath(section_idx, parent_para_idx, path_json, char_offset) {
        const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_setActiveFieldByPath(this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset);
        return ret !== 0;
    }
    /**
    * 활성 필드를 설정한다 (셀/글상자 내 문단 — 안내문 숨김용).
    * 변경이 발생하면 true를 반환한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {boolean} is_textbox
    * @returns {boolean}
    */
    setActiveFieldInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, is_textbox) {
        const ret = wasm.hwpdocument_setActiveFieldInCell(this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, is_textbox);
        return ret !== 0;
    }
    /**
    * 각주/미주 내부 수식 컨트롤의 속성을 변경한다.
    * @param {string} kind
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} note_control_idx
    * @param {number} note_para_idx
    * @param {number} inner_control_idx
    * @param {string} props_json
    * @returns {string}
    */
    setNoteEquationProperties(kind, section_idx, parent_para_idx, note_control_idx, note_para_idx, inner_control_idx, props_json) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(kind, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setNoteEquationProperties(retptr, this.__wbg_ptr, ptr0, len0, section_idx, parent_para_idx, note_control_idx, note_para_idx, inner_control_idx, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 투명선 표시 여부를 설정한다.
    * @param {boolean} enabled
    */
    setShowTransparentBorders(enabled) {
        wasm.hwpdocument_setShowTransparentBorders(this.__wbg_ptr, enabled);
    }
    /**
    * 각주/미주 내부 문단 속성 적용
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} fn_para_idx
    * @param {string} props_json
    * @returns {string}
    */
    applyParaFormatInFootnote(section_idx, para_idx, control_idx, fn_para_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_applyParaFormatInFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, fn_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 선택 영역을 HTML 문자열로 변환한다 (셀 내부).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} start_cell_para_idx
    * @param {number} start_char_offset
    * @param {number} end_cell_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    exportSelectionInCellHtml(section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_exportSelectionInCellHtml(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, start_cell_para_idx, start_char_offset, end_cell_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 커서에서 이전 방향으로 가장 가까운 선택 가능 컨트롤을 찾는다 (F11 키).
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    findNearestControlBackward(section_idx, para_idx, char_offset) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_findNearestControlBackward(retptr, this.__wbg_ptr, section_idx, para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * [Task #1142] 외부 file path 그림 reference 목록을 구조화된 JSON 배열로 반환한다.
    *
    * 반환: JSON 배열 `[{ key, binDataId, originalPath, basename, extension, loaded }, ...]`
    * @returns {string}
    */
    getExternalImageReferences() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getExternalImageReferences(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * path 기반: 중첩 표 셀의 필드 범위 정보를 조회한다.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @returns {string}
    */
    getFieldInfoAtByPath(section_idx, parent_para_idx, path_json, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getFieldInfoAtByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 커서 위치의 필드 범위 정보를 조회한다 (셀/글상자 내 문단).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {number} control_idx
    * @param {number} cell_idx
    * @param {number} cell_para_idx
    * @param {number} char_offset
    * @param {boolean} is_textbox
    * @returns {string}
    */
    getFieldInfoAtInCell(section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, is_textbox) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getFieldInfoAtInCell(retptr, this.__wbg_ptr, section_idx, parent_para_idx, control_idx, cell_idx, cell_para_idx, char_offset, is_textbox);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * 경로 기반 표 셀 바운딩박스 조회 (중첩 표용).
    *
    * 반환: JSON 배열 `[{"cellIdx":N,"row":N,"col":N,...,"x":F,"y":F,"w":F,"h":F}, ...]`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @returns {string}
    */
    getTableCellBboxesByPath(section_idx, parent_para_idx, path_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getTableCellBboxesByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 본문 인라인 각주 마커 히트테스트
    * @param {number} page_num
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    hitTestBodyFootnoteMarker(page_num, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_hitTestBodyFootnoteMarker(retptr, this.__wbg_ptr, page_num, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 페이지 단위로 이전/다음 머리말·꼬리말로 이동한다.
    *
    * 반환: JSON `{"ok":true,"pageIndex":N,"sectionIdx":N,"isHeader":bool,"applyTo":N}`
    * 또는 더 이상 이동할 페이지가 없으면 `{"ok":false}`
    * @param {number} current_page
    * @param {boolean} is_header
    * @param {number} direction
    * @returns {string}
    */
    navigateHeaderFooterByPage(current_page, is_header, direction) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_navigateHeaderFooterByPage(retptr, this.__wbg_ptr, current_page, is_header, direction);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 내부 클립보드의 내용을 cellPath가 가리키는 중첩 표 셀에 붙여넣는다.
    *
    * 반환값: JSON `{"ok":true,"cellParaIdx":<idx>,"charOffset":<offset>}`
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @returns {string}
    */
    pasteInternalInCellByPath(section_idx, parent_para_idx, path_json, char_offset) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_pasteInternalInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 다층 레이어 필터를 적용한 Canvas 렌더링 (Task #516, Stage 5.2).
    *
    * `layer_kind`:
    * - `"all"` → 모든 PaintOp 렌더 (기본 `renderPageToCanvas` 와 동일)
    * - `"background"` → page background layer
    * - `"flow"` → 본문 layer (BehindText / InFrontOfText plane 제외)
    * - `"behind"` → BehindText overlay layer
    * - `"front"` → InFrontOfText overlay layer
    *
    * 본문 Canvas 와 overlay 컨테이너를 분리하는 다층 layer 아키텍처에서 사용.
    * @param {number} page_num
    * @param {HTMLCanvasElement} canvas
    * @param {number} scale
    * @param {string} layer_kind
    */
    renderPageToCanvasFiltered(page_num, canvas, scale, layer_kind) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(layer_kind, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_renderPageToCanvasFiltered(retptr, this.__wbg_ptr, page_num, addBorrowedObject(canvas), scale, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @param {number} count
    * @returns {string}
    */
    deleteTextInCellByPath(section_idx, parent_para_idx, path_json, char_offset, count) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_deleteTextInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset, count);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 각주/미주 내부 문단 속성 조회
    * @param {number} section_idx
    * @param {number} para_idx
    * @param {number} control_idx
    * @param {number} fn_para_idx
    * @returns {string}
    */
    getParaPropertiesInFootnote(section_idx, para_idx, control_idx, fn_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getParaPropertiesInFootnote(retptr, this.__wbg_ptr, section_idx, para_idx, control_idx, fn_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 각주/미주 내부 선택 영역의 줄별 사각형을 반환한다.
    * @param {number} page_num
    * @param {number} footnote_index
    * @param {number} start_fn_para_idx
    * @param {number} start_char_offset
    * @param {number} end_fn_para_idx
    * @param {number} end_char_offset
    * @returns {string}
    */
    getSelectionRectsInFootnote(page_num, footnote_index, start_fn_para_idx, start_char_offset, end_fn_para_idx, end_char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getSelectionRectsInFootnote(retptr, this.__wbg_ptr, page_num, footnote_index, start_fn_para_idx, start_char_offset, end_fn_para_idx, end_char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @param {string} text
    * @returns {string}
    */
    insertTextInCellByPath(section_idx, parent_para_idx, path_json, char_offset, text) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_insertTextInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 경로 기반: 셀/글상자 내 문단 수를 반환한다 (중첩 표/글상자 지원).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @returns {number}
    */
    getCellParagraphCountByPath(section_idx, parent_para_idx, path_json) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCellParagraphCountByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 머리말/꼬리말 내 커서 위치의 픽셀 좌표를 반환한다.
    *
    * preferred_page: 선호 페이지 (더블클릭한 페이지). -1이면 첫 번째 발견 페이지 사용.
    * 반환: JSON `{"pageIndex":N,"x":F,"y":F,"height":F}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @param {number} char_offset
    * @param {number} preferred_page
    * @returns {string}
    */
    getCursorRectInHeaderFooter(section_idx, is_header, apply_to, hf_para_idx, char_offset, preferred_page) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getCursorRectInHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx, char_offset, preferred_page);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 내 문단 병합 (Backspace at start)
    *
    * 반환: JSON `{"ok":true,"hfParaIndex":<prev_idx>,"charOffset":<merge_point>}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @returns {string}
    */
    mergeParagraphInHeaderFooter(section_idx, is_header, apply_to, hf_para_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_mergeParagraphInHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 머리말/꼬리말 내 문단 분할 (Enter 키)
    *
    * 반환: JSON `{"ok":true,"hfParaIndex":<new_idx>,"charOffset":0}`
    * @param {number} section_idx
    * @param {boolean} is_header
    * @param {number} apply_to
    * @param {number} hf_para_idx
    * @param {number} char_offset
    * @returns {string}
    */
    splitParagraphInHeaderFooter(section_idx, is_header, apply_to, hf_para_idx, char_offset) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_splitParagraphInHeaderFooter(retptr, this.__wbg_ptr, section_idx, is_header, apply_to, hf_para_idx, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 경로 기반: 셀 내 문단의 글자 수를 반환한다 (중첩 표 지원).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @returns {number}
    */
    getCellParagraphLengthByPath(section_idx, parent_para_idx, path_json) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCellParagraphLengthByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * [Task #1138] 표 셀 내 Shape(글상자/사각형/도형) 속성 조회 (by_path).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} cell_path_json
    * @param {number} inner_control_idx
    * @returns {string}
    */
    getCellShapePropertiesByPath(section_idx, parent_para_idx, cell_path_json, inner_control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCellShapePropertiesByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, inner_control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * [Task #1138] 표 셀 내 Shape 속성 변경 (by_path).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} cell_path_json
    * @param {number} inner_control_idx
    * @param {string} props_json
    * @returns {string}
    */
    setCellShapePropertiesByPath(section_idx, parent_para_idx, cell_path_json, inner_control_idx, props_json) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setCellShapePropertiesByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, inner_control_idx, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * 구역 내 모든 연결선의 좌표를 연결된 도형 위치에 맞게 갱신한다.
    * @param {number} section_idx
    */
    updateConnectorsInSection(section_idx) {
        wasm.hwpdocument_updateConnectorsInSection(this.__wbg_ptr, section_idx);
    }
    /**
    * [Task #1171 / PR #1254] 표 셀/글상자 내부 Picture 삭제 (by_path).
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} cell_path_json
    * @param {number} inner_control_idx
    * @returns {string}
    */
    deleteCellPictureControlByPath(section_idx, parent_para_idx, cell_path_json, inner_control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_deleteCellPictureControlByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, inner_control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * [Task #1151 v4] 표 셀 내 Picture 속성 조회 (by_path). Shape 패턴 정합.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} cell_path_json
    * @param {number} inner_control_idx
    * @returns {string}
    */
    getCellPicturePropertiesByPath(section_idx, parent_para_idx, cell_path_json, inner_control_idx) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_getCellPicturePropertiesByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, inner_control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @returns {string}
    */
    mergeParagraphInCellByPath(section_idx, parent_para_idx, path_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_mergeParagraphInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * [Task #1151 v4] 표 셀 내 Picture 속성 변경 (by_path). Shape 패턴 정합.
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} cell_path_json
    * @param {number} inner_control_idx
    * @param {string} props_json
    * @returns {string}
    */
    setCellPicturePropertiesByPath(section_idx, parent_para_idx, cell_path_json, inner_control_idx, props_json) {
        let deferred4_0;
        let deferred4_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(cell_path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setCellPicturePropertiesByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, inner_control_idx, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr3 = r0;
            var len3 = r1;
            if (r3) {
                ptr3 = 0; len3 = 0;
                throw takeObject(r2);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
    * @param {number} section_idx
    * @param {number} parent_para_idx
    * @param {string} path_json
    * @param {number} char_offset
    * @returns {string}
    */
    splitParagraphInCellByPath(section_idx, parent_para_idx, path_json, char_offset) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(path_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_splitParagraphInCellByPath(retptr, this.__wbg_ptr, section_idx, parent_para_idx, ptr0, len0, char_offset);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * [Task #825] 머리말/꼬리말 안 그림의 속성 조회.
    * path: section[si].paragraphs[outer_para].controls[outer_ctrl] = Header/Footer
    *       → .paragraphs[inner_para].controls[inner_ctrl] = Picture
    * @param {number} section_idx
    * @param {number} outer_para_idx
    * @param {number} outer_control_idx
    * @param {number} inner_para_idx
    * @param {number} inner_control_idx
    * @returns {string}
    */
    getHeaderFooterPictureProperties(section_idx, outer_para_idx, outer_control_idx, inner_para_idx, inner_control_idx) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_getHeaderFooterPictureProperties(retptr, this.__wbg_ptr, section_idx, outer_para_idx, outer_control_idx, inner_para_idx, inner_control_idx);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * [Task #825] 머리말/꼬리말 안 그림 속성 변경.
    * @param {number} section_idx
    * @param {number} outer_para_idx
    * @param {number} outer_control_idx
    * @param {number} inner_para_idx
    * @param {number} inner_control_idx
    * @param {string} props_json
    * @returns {string}
    */
    setHeaderFooterPictureProperties(section_idx, outer_para_idx, outer_control_idx, inner_para_idx, inner_control_idx, props_json) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(props_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_setHeaderFooterPictureProperties(retptr, this.__wbg_ptr, section_idx, outer_para_idx, outer_control_idx, inner_para_idx, inner_control_idx, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
    * 특정 언어 카테고리에서 글꼴 이름으로 ID를 찾거나 등록한다.
    * @param {number} lang
    * @param {string} name
    * @returns {number}
    */
    findOrCreateFontIdForLang(lang, name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hwpdocument_findOrCreateFontIdForLang(this.__wbg_ptr, lang, ptr0, len0);
        return ret;
    }
    /**
    * HWP 파일 바이트를 로드하여 문서 객체를 생성한다.
    * @param {Uint8Array} data
    */
    constructor(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hwpdocument_new(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 현재 DPI를 반환한다.
    * @returns {number}
    */
    getDpi() {
        const ret = wasm.hwpdocument_getDpi(this.__wbg_ptr);
        return ret;
    }
    /**
    * DPI를 설정한다.
    * @param {number} dpi
    */
    setDpi(dpi) {
        wasm.hwpdocument_setDpi(this.__wbg_ptr, dpi);
    }
    /**
    * 페이지 좌표에서 문서 위치를 찾는다.
    *
    * 반환: JSON `{"sectionIndex":N,"paragraphIndex":N,"charOffset":N}`
    * @param {number} page_num
    * @param {number} x
    * @param {number} y
    * @returns {string}
    */
    hitTest(page_num, x, y) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_hitTest(retptr, this.__wbg_ptr, page_num, x, y);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * Batch 모드를 종료하고 누적된 이벤트를 반환한다.
    * @returns {string}
    */
    endBatch() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpdocument_endBatch(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
}

const HwpViewerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hwpviewer_free(ptr >>> 0));
/**
* WASM 뷰어 컨트롤러 (뷰포트 관리 + 스케줄링)
*/
export class HwpViewer {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HwpViewerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hwpviewer_free(ptr);
    }
    /**
    * 총 페이지 수
    * @returns {number}
    */
    pageCount() {
        const ret = wasm.hwpdocument_pageCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 현재 보이는 페이지 목록 반환
    * @returns {Uint32Array}
    */
    visiblePages() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpviewer_visiblePages(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 특정 페이지 SVG 렌더링
    * @param {number} page_num
    * @returns {string}
    */
    renderPageSvg(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpviewer_renderPageSvg(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 뷰포트 업데이트 (스크롤/리사이즈 시 호출)
    * @param {number} scroll_x
    * @param {number} scroll_y
    * @param {number} width
    * @param {number} height
    */
    updateViewport(scroll_x, scroll_y, width, height) {
        wasm.hwpviewer_updateViewport(this.__wbg_ptr, scroll_x, scroll_y, width, height);
    }
    /**
    * 특정 페이지 HTML 렌더링
    * @param {number} page_num
    * @returns {string}
    */
    renderPageHtml(page_num) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hwpviewer_renderPageHtml(retptr, this.__wbg_ptr, page_num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
    * 대기 중인 렌더링 작업 수
    * @returns {number}
    */
    pendingTaskCount() {
        const ret = wasm.hwpviewer_pendingTaskCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * 뷰어 생성
    * @param {HwpDocument} document
    */
    constructor(document) {
        _assertClass(document, HwpDocument);
        var ptr0 = document.__destroy_into_raw();
        const ret = wasm.hwpviewer_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * 줌 변경
    * @param {number} zoom
    */
    setZoom(zoom) {
        wasm.hwpviewer_setZoom(this.__wbg_ptr, zoom);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_instanceof_Window_f401953a2cf86220 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_document_5100775d18896c16 = function(arg0) {
        const ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createElement_8bae7856a4bb7411 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_width_e870de808b523851 = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_addColorStop_9269a253957ed919 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).addColorStop(arg1, getStringFromWasm0(arg2, arg3));
    }, arguments) };
    imports.wbg.__wbg_naturalWidth_71b3dd9a08fc5b67 = function(arg0) {
        const ret = getObject(arg0).naturalWidth;
        return ret;
    };
    imports.wbg.__wbg_new_e6ce9457ca710f38 = function() { return handleError(function () {
        const ret = new Image();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setsrc_681ceacdf6845f60 = function(arg0, arg1, arg2) {
        getObject(arg0).src = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_complete_84c002eb21c7e079 = function(arg0) {
        const ret = getObject(arg0).complete;
        return ret;
    };
    imports.wbg.__wbg_setheight_dc240617639f1f51 = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_df50fa48a8876636 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_width_aee8b8809b033b05 = function(arg0) {
        const ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_height_80053d3c71b338e0 = function(arg0) {
        const ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_setwidth_080107476e633963 = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_46bdbf323b0b18d1 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_20bf99ccc051643b = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_beginPath_c7b9e681f2d031ca = function(arg0) {
        getObject(arg0).beginPath();
    };
    imports.wbg.__wbg_clearRect_05de681275dda635 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_closePath_1e01ade2e4928be9 = function(arg0) {
        getObject(arg0).closePath();
    };
    imports.wbg.__wbg_setfilter_f0f66caa5d2dc498 = function(arg0, arg1, arg2) {
        getObject(arg0).filter = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_strokeRect_98e37f7c38874af3 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).strokeRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_strokeText_2621465108eb16eb = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).strokeText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_measureText_ea212ea07011bf71 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).measureText(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setlineCap_561c8efd4e48949c = function(arg0, arg1, arg2) {
        getObject(arg0).lineCap = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setLineDash_aed2919a1550112b = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).setLineDash(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_setfillStyle_4de94b275f5761f2 = function(arg0, arg1) {
        getObject(arg0).fillStyle = getObject(arg1);
    };
    imports.wbg.__wbg_setlineWidth_ea4c8cb72d8cdc31 = function(arg0, arg1) {
        getObject(arg0).lineWidth = arg1;
    };
    imports.wbg.__wbg_settextAlign_d4f121248c40b910 = function(arg0, arg1, arg2) {
        getObject(arg0).textAlign = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_bezierCurveTo_b022738e9f321e48 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).bezierCurveTo(arg1, arg2, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_setshadowBlur_5fc1d8ac175f1289 = function(arg0, arg1) {
        getObject(arg0).shadowBlur = arg1;
    };
    imports.wbg.__wbg_setglobalAlpha_d73578e4c446b8b4 = function(arg0, arg1) {
        getObject(arg0).globalAlpha = arg1;
    };
    imports.wbg.__wbg_setshadowColor_e5e9fd59918f8260 = function(arg0, arg1, arg2) {
        getObject(arg0).shadowColor = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setstrokeStyle_c79ba6bc36a7f302 = function(arg0, arg1) {
        getObject(arg0).strokeStyle = getObject(arg1);
    };
    imports.wbg.__wbg_settextBaseline_a36b2a6259ade423 = function(arg0, arg1, arg2) {
        getObject(arg0).textBaseline = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_quadraticCurveTo_62c16890d8f55358 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).quadraticCurveTo(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_setshadowOffsetX_92efb34ac3776b02 = function(arg0, arg1) {
        getObject(arg0).shadowOffsetX = arg1;
    };
    imports.wbg.__wbg_setshadowOffsetY_83d019ffa7b3739c = function(arg0, arg1) {
        getObject(arg0).shadowOffsetY = arg1;
    };
    imports.wbg.__wbg_createLinearGradient_c6e8705fffba9558 = function(arg0, arg1, arg2, arg3, arg4) {
        const ret = getObject(arg0).createLinearGradient(arg1, arg2, arg3, arg4);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createRadialGradient_72dd3cd4393b5c5d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        const ret = getObject(arg0).createRadialGradient(arg1, arg2, arg3, arg4, arg5, arg6);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_createPattern_f88dd375094c94dc = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).createPattern(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_arc_3fa57906f6d0666e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).arc(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_drawImage_14f72ed9b8430e9d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_clip_8e9c040e47fe414a = function(arg0) {
        getObject(arg0).clip();
    };
    imports.wbg.__wbg_fill_7f376d2e52c3054e = function(arg0) {
        getObject(arg0).fill();
    };
    imports.wbg.__wbg_rect_f9c895e4d838c33a = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).rect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_save_b2ec4f4afd250d50 = function(arg0) {
        getObject(arg0).save();
    };
    imports.wbg.__wbg_scale_9babba91f6f5b5d4 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).scale(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_arcTo_3be1225f4778e148 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).arcTo(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_rotate_782a5d702e1a58a7 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).rotate(arg1);
    }, arguments) };
    imports.wbg.__wbg_stroke_b125233fc8b11e59 = function(arg0) {
        getObject(arg0).stroke();
    };
    imports.wbg.__wbg_drawImage_692e9c2f4b86d1e9 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    }, arguments) };
    imports.wbg.__wbg_ellipse_bc56cfd0d42fc764 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        getObject(arg0).ellipse(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
    }, arguments) };
    imports.wbg.__wbg_lineTo_863448482ad2bd29 = function(arg0, arg1, arg2) {
        getObject(arg0).lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_moveTo_5526d0fa563650fa = function(arg0, arg1, arg2) {
        getObject(arg0).moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_restore_b0b630dcf5875c16 = function(arg0) {
        getObject(arg0).restore();
    };
    imports.wbg.__wbg_setfont_a4d031cf2c94b4db = function(arg0, arg1, arg2) {
        getObject(arg0).font = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_fillRect_b5c8166281bac9df = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_fillText_6dfde0e3b04c85db = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_translate_2ec050ab1f49f6fc = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).translate(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_207b558942527489 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_16b304a2cfa7ff4a = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_of_647f9238b4d5407a = function(arg0, arg1) {
        const ret = Array.of(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_a5b05aedc7234f9f = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('rhwp_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
