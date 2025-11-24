import { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPen, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import ThumbFrame from "./ThumbFrame";

interface Carrossel2Props {
  obj: any;
  width?: number;
  marginStart?: number;
  height?: number;
  isloading?: boolean;
  titulos?: boolean;
  contAssist?: boolean;
  isFav?: boolean;
  onDelete?: (e: any) => void;
}

const Carrossel2 = ({
  obj,
  width = 50,
  height = 40,
  marginStart = 0.2,
  isloading = false,
  titulos = false,
  contAssist = false,
  isFav = false,
  onDelete = () => {},
}: Carrossel2Props) => {
  const wdToPixel = width * 4;
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showRControl, setShowRControl] = useState(true);
  const [isEdit, setEdit] = useState(false);

  // 1. Cria uma referência para o contêiner do carrossel
  const containerRef = useRef<HTMLDivElement>(null);
  // 2. Estado para armazenar a largura do contêiner
  const [containerWidth, setContainerWidth] = useState(0);

  // 3. Usa useEffect e ResizeObserver para monitorar o tamanho do contêiner
  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;
    setContainerWidth(containerElement.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerElement);
    return () => {
      observer.disconnect();
    };
  }, []);

  // 4. Recalcula a visibilidade dos controles com base na largura do contêiner
  useEffect(() => {
    const contentWidth = wdToPixel * obj.length + wdToPixel * marginStart;
    setShowControls(contentWidth > containerWidth);

    if (contentWidth <= containerWidth) {
      setCurrent(0);
      setShowRControl(true);
    }
  }, [containerWidth, obj, wdToPixel, marginStart]);

  const next = () => {
    if (wdToPixel * (obj.length - current - 1) + wdToPixel * marginStart <= containerWidth) {
      setCurrent(current + 1);
      setShowRControl(false);
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    current === 0 ? setCurrent(0) : setCurrent(current - 1);
    if (!showRControl) {
      setShowRControl(true);
    }
  };

  return (
    // 5. Atribui a referência (ref) ao contêiner principal
    <div className="w-full" ref={containerRef}>
      <div className="relative overflow-hidden">
        {/* botão de editar posicionado ao final (canto direito) da área visível */}
        {isFav && (
          <div className="absolute right-4 top--10 z-40">
            <button
              onClick={() => setEdit(!isEdit)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                isEdit ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-white/6 text-slate-200 hover:bg-white/10"
              }`}
              aria-pressed={isEdit}
              title={isEdit ? "Finalizar edição" : "Editar favoritos"}
            >
              <FaPen />
              <span className="sr-only">Editar</span>
            </button>
          </div>
        )}

        {isloading && (
          <div
            className="flex space-x-3"
            style={{
              marginInlineStart: `${wdToPixel * marginStart}px`,
              width: 8 * wdToPixel,
            }}
          >
            {Array.from({ length: 8 }, (index: number) => (
              <div
                key={index}
                className="rounded-md bg-gray-500"
                style={{
                  width: `${wdToPixel}px`,
                  height: `${wdToPixel * 1.5}px`,
                }}
              ></div>
            ))}
          </div>
        )}
        <div
          className="flex space-x-3 transition ease-out duration-500 py-4"
          style={{
            transform: `translateX(-${current * wdToPixel}px)`,
            marginInlineStart: `${wdToPixel * marginStart}px`,
            width: obj.length * wdToPixel,
          }}
        >
          {!isloading &&
            obj.map((item: any) => (
              <div
                key={item.id}
                className={`text-gray-200 relative w-full ${!isEdit ? "hover:scale-110" : ""} transition-all duration-300`}
              >
                {item.tipo == "Filme" ? (
                  <>
                    {contAssist ? (
                      <>
                        <Link to={`/reproducao/filme/${item.id}`} key={`${item.tipo}-${item.id}`}>
                          <ThumbFrame
                            src={`https://kplus-api.onrender.com${item.thumb_url}`}
                            tempo_assist={item.tempo_assist}
                            duracao={item.duracao}
                            width={width}
                            height={height}
                          />
                        </Link>
                      </>
                    ) : (
                      <>
                        {isEdit && (
                          <div
                            onClick={() => onDelete(item)}
                            className="absolute top-0 right-0 h-6 w-6 bg-red-500 hover:scale-110 rounded-full translate-x-1/3 -translate-y-1/3 origin-center z-20 flex justify-center items-center"
                          >
                            <FaTimes color="white" size={16} />
                          </div>
                        )}
                        <Link to={`/filmes/${item.id}`} key={`${item.tipo}-${item.id}`}>
                          <ThumbFrame
                            src={`https://kplus-api.onrender.com${item.thumb_url}`}
                            tempo_assist={item.tempo_assist}
                            duracao={item.duracao}
                            width={width}
                            height={height}
                          />
                        </Link>
                      </>
                    )}

                    {titulos && (
                      <Link className="line-clamp-1" to={`/filmes/${item.id}`}>
                        {item.titulo}
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    {contAssist ? (
                      <Link to={`reproducao/serie/${item.id}`} key={`${item.tipo}-${item.id}`}>
                        <ThumbFrame
                          src={`https://kplus-api.onrender.com${item.thumb_url}`}
                          tempo_assist={item.tempo_assist}
                          duracao={item.duracao}
                          width={width}
                          height={height}
                        />
                      </Link>
                    ) : (
                      <>
                        {isEdit && (
                          <div
                            onClick={() => onDelete(item)}
                            className="absolute top-0 right-0 h-6 w-6 bg-red-500 rounded-full hover:scale-110 translate-x-1/3 -translate-y-1/3 origin-center flex justify-center items-center z-20"
                          >
                            <FaTimes color="white" size={16} />
                          </div>
                        )}
                        <Link to={`/series/${item.id}`} key={`${item.tipo}-${item.id}`}>
                          <ThumbFrame
                            src={`https://kplus-api.onrender.com${item.thumb_url}`}
                            tempo_assist={item.tempo_assist}
                            duracao={item.duracao}
                            width={width}
                            height={height}
                          />
                        </Link>
                      </>
                    )}
                    {titulos && (
                      <>
                        <Link to={`/series/${item.id}`}>{item.titulo}</Link>
                        {contAssist && (
                          <p>{`T${item.nm_temp}:E${item.nm_ep}: ${item.titulo_episodio}`}</p>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
        {showControls && (
          <div className="pointer-events-none text-transparent absolute top-0 h-full w-full flex justify-between items-center text-2xl">
            <div
              className="flex items-center bg-gradient-to-r transition ease-out duration-500 hover:from-black/60 from-30% to-transparent to-90% hover:text-white hover:backdrop-blur-[1px] h-full w-8 justify-center pointer-events-auto "
              onClick={() => prev()}
              style={{
                width: wdToPixel * marginStart,
              }}
            >
              <FaChevronLeft className="hover:text-3xl transition-all ease-out duration-300" />
            </div>
            {showRControl && (
              <div
                className="flex items-center bg-gradient-to-l transition ease-out duration-500 hover:from-black/60 from-30% to-transparent to-90% hover:backdrop-blur-[1px] h-full w-8 justify-center pointer-events-auto  hover:text-white"
                onClick={() => next()}
                style={{
                  width: wdToPixel * marginStart,
                }}
              >
                <FaChevronRight className="hover:text-3xl transition-all ease-out duration-300" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrossel2;